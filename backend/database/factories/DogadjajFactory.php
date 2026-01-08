<?php

namespace Database\Factories;

use App\Models\TipDogadjaja;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dogadjaj>
 */
class DogadjajFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idTipaDogadjaja' => TipDogadjaja::inRandomOrder()->first()->id,
            'idKorisnika' => User::inRandomOrder()->first()->id,
            'naslov' => $this->faker->sentence,
            'datumVremeOd' => $this->faker->dateTimeBetween('now', '+1 week'),
            'datumVremeDo' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
            'opis' => $this->faker->paragraph,
            'lokacija' => $this->faker->address,
            'privatnost' => $this->faker->boolean(),
        ];
    }
}
