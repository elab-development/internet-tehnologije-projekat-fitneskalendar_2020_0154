<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create([
            'ime' => 'Andjela',
            'prezime' => 'Stankovic',
            'email' => 'as20200154@student.fon',
            'password' => bcrypt('as20200154'),
            'uloga' => 'admin',
        ]);
        User::factory()->count(10)->create();
    }
}
