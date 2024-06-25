<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dogadjaj extends Model
{
    use HasFactory;
    protected $fillable = [
        "idTipaDogadjaja",
        "idKorisnika",
        "datumVremeOd",
        "datumVremeDo",
        "opis",
        "lokacija",
        'privatnost'
    ];

    public function korisnik()
    {
        //jer korisnik pravi dogadjaj, dakle dogadjaj pripada korisniku
        return $this->belongsTo(User::class);
    }

    public function kategorija()
    {
        //jer dogadjaj ima svoj tip, dakle pripada tipu
        return $this->belongsTo(TipDogadjaja::class);
    }

    public function notifikacija()
    {
        //zato sto dogadjaj moze da salje vise notifikacija
        return $this->hasMany(Notifikacija::class);
    }
}
