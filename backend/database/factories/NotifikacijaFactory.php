<?php

namespace Database\Factories;

use App\Models\Dogadjaj;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notifikacija>
 */
class NotifikacijaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'idDogadjaja' => Dogadjaj::inRandomOrder()->first()->id,
            'poruka' => $this->faker->sentence,
            'vremeSlanja' => $this->faker->dateTimeBetween('-1 day', 'now'),
        ];
    }
}
