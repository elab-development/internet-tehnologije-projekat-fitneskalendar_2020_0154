<?php

namespace App\Console\Commands;

use App\Mail\NotifikacijaMail;
use App\Models\Dogadjaj;
use App\Models\Notifikacija;
use App\Models\User;
use Carbon\Carbon;
use Dotenv\Validator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class PosaljiNotifikaciju extends Command
{
    protected $signature = 'notifikacije:posalji';

    protected $description = 'Komanda za slanje notifikacija putem email-a';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        //schedule se preko Task Schedule pokrece na svaki minut. Na svaki minut se pokrece notifikacije:posalji
        //tj ovaj kod
        //za svaki minut proveravamo da li postoji notifikacija koja treba da se posalje
        $currentDateTime = Carbon::now('Europe/Belgrade'); //ovo mora jer iz nekog razloga vraca pogresno vreme
        $notifikacije = Notifikacija::whereYear('vremeSlanja', $currentDateTime->year)
        ->whereMonth('vremeSlanja', $currentDateTime->month)
        ->whereDay('vremeSlanja', $currentDateTime->day)
        ->whereRaw('HOUR(vremeSlanja) = ?', [$currentDateTime->hour])
        ->whereRaw('MINUTE(vremeSlanja) = ?', [$currentDateTime->minute])
        ->get();
          $this->info(json_encode($notifikacije, JSON_PRETTY_PRINT));
        foreach ($notifikacije as $notifikacija) {
            try {
                $dogadjaj = Dogadjaj::find($notifikacija->idDogadjaja);
    
                if ($dogadjaj && $dogadjaj->korisnik) {
                    $user = $dogadjaj->korisnik;
                    //mora da bude moj mejl jer mailtrap dozvoljava da se salje samo
                    //sa mejla koji je napravio nalog na mailtrapu
                    if (!empty($user->email) && $user->email === 'stankovicandjela53@gmail.com') {
                        Mail::to($user->email)->send(new NotifikacijaMail($notifikacija,$dogadjaj));
                        $this->info('Notifikacija poslata korisniku: ' . $user->email);
                    } else {
                        $this->error('Email nije odgovarajuci ili je prazan. Ne saljemo notifikaciju.');
                    }
                } else {
                    $this->error('Dogadjaj ili korisnik ne postoji.');
                }
            } catch (\Exception $e) {
                $this->error('Greška prilikom slanja notifikacije: ' . $e->getMessage(). ' - ' . $e->getFile() . ' on line ' . $e->getLine());
            }
        }
    
        $this->info('Sve notifikacije su poslate.');
}}