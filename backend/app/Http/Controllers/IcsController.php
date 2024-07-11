<?php
 
namespace App\Http\Controllers;
 
use App\Models\Dogadjaj;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
 
class IcsController extends Controller
{
    public function generateIcs($eventId)
    {
        try {
            $event = Dogadjaj::findOrFail($eventId);
           
            $dtStart = Carbon::parse($event->datumVremeOd)->utc()->format('Ymd\THis\Z');
            $dtEnd = Carbon::parse($event->datumVremeDo)->utc()->format('Ymd\THis\Z');
           
            $icsContent = "BEGIN:VCALENDAR\r\n";
            $icsContent .= "VERSION:2.0\r\n";
            $icsContent .= "PRODID:-//Your Company//NONSGML Event//EN\r\n";
            $icsContent .= "BEGIN:VEVENT\r\n";
            $icsContent .= "DTSTART:$dtStart\r\n";
            $icsContent .= "DTEND:$dtEnd\r\n";
            $icsContent .= "SUMMARY:" . Str::limit($event->naslov, 255) . "\r\n";
            $icsContent .= "DESCRIPTION:" . Str::limit($event->opis, 255) . "\r\n";
            $icsContent .= "LOCATION:" . Str::limit($event->lokacija, 255) . "\r\n";
            $icsContent .= "END:VEVENT\r\n";
            $icsContent .= "END:VCALENDAR\r\n";
 
            $fileName = 'event-' . $event->id . '.ics';
            Storage::disk('local')->put($fileName, $icsContent);
 
            return response()->download(storage_path("app/{$fileName}"));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was an error generating the ICS file',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}