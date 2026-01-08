<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipDogadjaja extends Model
{
    use HasFactory;
    protected $fillable = [
        'naziv',
        'opis',
        'idKorisnika'
    ];

    public function dogadjaji()
    {
        //zato sto jedan tip moze biti dodeljen vise dogadjaja
        //dakle jednom tipu dogadjaja pripada vise dogadjaja
        return $this->hasMany(Dogadjaj::class);
    }
    public function korisnik()
    {
        // Zato sto jedan tip dogadjaja pripada jednom korisniku
        return $this->belongsTo(User::class, 'idKorisnika');
    }
}
