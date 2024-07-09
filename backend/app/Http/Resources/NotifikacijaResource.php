<?php

namespace App\Http\Resources;

use Egulias\EmailValidator\Warning\TLD;
use Illuminate\Http\Resources\Json\JsonResource;

class NotifikacijaResource extends JsonResource
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
            'id'=>$this->id,
            'poruka'=>$this->poruka,
            'vremeSlanja'=>$this->vremeSlanja,
            'idDogadjaja' => $this->idDogadjaja
        ];
    }
}
