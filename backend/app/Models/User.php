<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        //nema id polja jer kada se koristi Eloquent ORM za kreiranje
        //novog reda u bazi, Laravel sam generise id
        'ime',
        'prezime',
        'email',
        'password',
        'uloga'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function dogadjaji()
    {
        //zato sto korisnik moze da kreira vise dogadjaja
        return $this->hasMany(Dogadjaj::class);
    }
    public function tipovi()
    {
        //zato sto korisnik moze da kreira vise tipova dogadjaja
        return $this->hasMany(TipDogadjaja::class);
    }
}
