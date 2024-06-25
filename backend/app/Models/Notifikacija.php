<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikacija extends Model
{
    use HasFactory;
    protected $fillable = [
        'ddDogadjaja',
        'poruka'
    ];

    public function dogadjaj()
    {
        //zato sto notifikacija pripada dogadjaju
        return $this->belongsTo(Dogadjaj::class);
    }

    
}
