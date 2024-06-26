<?php

namespace Database\Seeders;

use App\Models\Dogadjaj;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DogadjajSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Dogadjaj::factory()->count(10)->create();
    }
}
