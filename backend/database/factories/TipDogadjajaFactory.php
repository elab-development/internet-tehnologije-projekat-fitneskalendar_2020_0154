<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TipDogadjaja>
 */
class TipDogadjajaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // return [
        //     'naziv' => $this->faker->randomElement(['Praznik','Trening','FakultetskeObaveze']),
        //     'opis' => $this->faker->sentence,
        // ];
        return [
            'naziv' => $this->faker->word,
            'opis' => $this->faker->sentence,
        ];
    }
}
