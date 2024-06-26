<?php

namespace Database\Seeders;

use App\Models\TipDogadjaja;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipDogadjajaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TipDogadjaja::factory()->count(5)->create();
    }
}
