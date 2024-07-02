<?php

namespace App\Http\Resources;

use App\Http\Controllers\UserController;
use Egulias\EmailValidator\Warning\TLD;
use Illuminate\Http\Resources\Json\JsonResource;

class DogadjajResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return[
            'id' =>$this->id,
            'korisnik' => new UserResource($this->whenLoaded('korisnik')),
            'tipDogadjaj' =>new TipDogadjajaResource($this->whenLoaded('kategorija')),
            'naslov' => $this->naslov,
            'datumVremeOd' => $this->datumVremeOd,
            'datumVremeDo' => $this->datumVremeDo,
            'opis' => $this->opis,
            'lokacija' => $this->lokacija,
            'privatnost' => $this->privatnost,
        ];
    }
}
