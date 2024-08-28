<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\File;

class GoogleController extends Controller
{


    public function redirect(Request $request)
    {
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->addScope(\Google\Service\Calendar::CALENDAR);

        $eventData = $request->all();

        $authUrl = $client->createAuthUrl();

        $state = json_encode($eventData);

        Session::put('eventData', $request->all());
        $authUrl .= '&state=' . urlencode($state);

        return response()->json(['authUrl' => $authUrl]);
    }

    public function handleGoogleCallback(Request $request)
    {

        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setHttpClient(new \GuzzleHttp\Client([
            'verify' => false
        ]));
        if ($request->has('code')) {
            try {
                $sessionDir = storage_path('framework/sessions');

                $files = File::files($sessionDir);

                if (empty($files)) {
                    return response()->json(['message' => 'No session files found'], 404);
                }


                $lastFile = collect($files)->sortByDesc(function ($file) {
                    return $file->getMTime();
                })->first();


                $sessionContent = File::get($lastFile);
                $sessionArray = unserialize($sessionContent);


                $eventDataArray = $sessionArray['eventData'] ?? null;

                $client->fetchAccessTokenWithAuthCode($request->code);
                $token = $client->getAccessToken();
                session(['google_access_token' => $token]);

                $service = new \Google\Service\Calendar($client);

                function checkAndCreateCalendar($service, $nazivTipaDogadjaja)
                {

                    $calendarTitle = $nazivTipaDogadjaja;

                    // Proveri da li kalendar već postoji po njegovom naslovu (summary)
                    $calendarList = $service->calendarList->listCalendarList();
                    foreach ($calendarList->getItems() as $calendarListEntry) {
                        if ($calendarListEntry->getSummary() === $calendarTitle) {
                            // Kalendar već postoji, vrati njegov ID
                            return $calendarListEntry->getId();
                        }
                    }


                    $calendar = new \Google\Service\Calendar\Calendar([
                        'summary' => $calendarTitle,
                        'timeZone' => 'Europe/Belgrade',
                    ]);

                    try {
                        $createdCalendar = $service->calendars->insert($calendar);
                        $calendarId = $createdCalendar->getId(); //automatski generisan id
                        return $calendarId;
                    } catch (\Google_Service_Exception $e) {
                        throw $e;
                    } catch (\Exception $e) {
                        throw $e;
                    }
                }

                $event = new \Google\Service\Calendar\Event([
                    'summary' => $eventDataArray['naslov'] ?? 'Naziv',
                    'start' => [
                        'dateTime' => isset($eventDataArray['datumVremeOd']) ?
                            (new \DateTime($eventDataArray['datumVremeOd']))->format(\DateTime::ATOM) :
                            '2024-08-24T09:00:00+02:00',
                        'timeZone' => 'Europe/Belgrade',
                    ],
                    'end' => [
                        'dateTime' => isset($eventDataArray['datumVremeDo']) ?
                            (new \DateTime($eventDataArray['datumVremeDo']))->format(\DateTime::ATOM) :
                            '2024-08-24T17:00:00+02:00',
                        'timeZone' => 'Europe/Belgrade',
                    ],
                    'visibility' => $eventDataArray['privatnost'] ? 'private' : 'public'
                ]);
                if (!empty($eventDataArray['lokacija'])) {
                    $event->setLocation($eventDataArray['lokacija']);
                }

                if (!empty($eventDataArray['opis'])) {
                    $event->setDescription($eventDataArray['opis']);
                }


                $idKalendara =  checkAndCreateCalendar($service, $eventDataArray['nazivTipaDogadjaja']);

                $event = $service->events->insert($idKalendara, $event);

                return redirect()->away($event->htmlLink);
            } catch (\Exception $e) {

                return redirect()->route('calendar.event.create')->withErrors('Failed to create event: ' . $e->getMessage());
            }
        } else {
            return redirect()->route('calendar.event.create')->withErrors('Failed to retrieve authorization code.');
        }
    }
}
