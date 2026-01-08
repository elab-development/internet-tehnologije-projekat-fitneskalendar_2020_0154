<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

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
            // dd($request->code);
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
                //  dd($sessionContent);
                $sessionArray = unserialize($sessionContent);
                //dd($sessionArray);
                if (!$request->session()->has('eventData')) {
                    // Očisti sesiju ili osveži pre nego što pristupiš podacima
                    $request->session()->regenerate();
                }
                $eventDataArray = $sessionArray['eventData'] ?? null;
                //dd($eventDataArray);

                $client->fetchAccessTokenWithAuthCode($request->code);
                $token = $client->getAccessToken();
                session(['google_access_token' => $token]);

                $serializedData = serialize($token);
                Storage::disk('local')->put('google_token.txt', $serializedData);

                $service = new \Google\Service\Calendar($client);

                function checkAndCreateCalendar($service, $nazivTipaDogadjaja)
                {

                    $calendarTitle = $nazivTipaDogadjaja;

                    // provera da li kalendar već postoji po njegovom naslovu (summary)
                    $calendarList = $service->calendarList->listCalendarList();
                    foreach ($calendarList->getItems() as $calendarListEntry) {
                        if ($calendarListEntry->getSummary() === $calendarTitle) {
                            // kalendar već postoji, vrati njegov ID
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
                $startDateTime = new \DateTime($eventDataArray['datumVremeOd'], new \DateTimeZone('Europe/Belgrade'));
                $endDateTime = new \DateTime($eventDataArray['datumVremeDo'], new \DateTimeZone('Europe/Belgrade'));

                $startDateTimeUTC = $startDateTime->setTimezone(new \DateTimeZone('UTC'));
                $endDateTimeUTC = $endDateTime->setTimezone(new \DateTimeZone('UTC'));
                $visibility = isset($eventDataArray['privatnost']) && $eventDataArray['privatnost'] ? 'private' : 'public';
                $event = new \Google\Service\Calendar\Event([
                    'summary' => $eventDataArray['naslov'] ?? 'Naziv',
                    'start' => [
                        'dateTime' => $startDateTimeUTC->format(\DateTime::ATOM),
                        'timeZone' => 'UTC',
                    ],
                    'end' => [
                        'dateTime' => $endDateTimeUTC->format(\DateTime::ATOM),
                        'timeZone' => 'UTC',
                    ],
                    'visibility' => $visibility
                ]);
                // dd($event->start);

                if (!empty($eventDataArray['lokacija'])) {
                    $event->setLocation($eventDataArray['lokacija']);
                }

                if (!empty($eventDataArray['opis'])) {
                    $event->setDescription($eventDataArray['opis']);
                }
                $reminders = new \Google\Service\Calendar\EventReminders();

                if (isset($eventDataArray['reminders']['overrides']) && is_array($eventDataArray['reminders'])) {
                    $useDefault = $eventDataArray['reminders']['useDefault'];
                    $reminders->setUseDefault($useDefault === 'true');
                    
                    if ($useDefault === 'false') {
                        $overrides = [];
                        foreach ($eventDataArray['reminders']['overrides'] as $reminder) {
                            $eventReminder = new \Google\Service\Calendar\EventReminder();
                            $eventReminder->setMethod($reminder['method']);
                            $eventReminder->setMinutes((int) $reminder['minutes']);

                            $overrides[] = $eventReminder;
                        }
                        $reminders->setOverrides($overrides);
                    }

                    $event->setReminders($reminders);
                }

                $idKalendara =  checkAndCreateCalendar($service, $eventDataArray['nazivTipaDogadjaja']);

                $event = $service->events->insert($idKalendara, $event);

                return redirect()->away($event->htmlLink);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => [
                        'message' => $e->getMessage(),
                        'code' => $e->getCode(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString(),
                    ]
                ], 500);
            }
        } else {
            return redirect()->route('calendar.event.create')->withErrors('Failed to retrieve authorization code.');
        }
    }

    public function logout(Request $request)
    {
        try {
            $tokenPath = storage_path('app/google_token.txt');

            if (file_exists($tokenPath)) {
                $tokenData = unserialize(file_get_contents($tokenPath));
                $accessToken = $tokenData['access_token'] ?? null;
        
                if ($accessToken) {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/revoke');
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['token' => $accessToken]));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // onemogucivanje SSL verifikacije

                    curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
        
                    if ($httpCode == 200) {
                        Storage::disk('local')->delete('google_token.txt');
                        return response()->json(['message' => 'Logout uspešan'], 200);
                    } else {
                        return response()->json(['error' => 'Neuspelo opozivanje tokena'], 500);
                    }
                } else {
                    return response()->json(['error' => 'Token nije pronađen'], 404);
                }
            } else {
                return response()->json(['error' => 'Token fajl ne postoji'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Greška prilikom logout-a: ' . $e->getMessage()], 500);
        }
       
    }
}
