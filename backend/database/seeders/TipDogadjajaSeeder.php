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
        // TipDogadjaja::factory()->count(6)->create();

        $tipoviDogadjaja = [
            ['naziv' => 'Posao', 'opis' => 'Sastanci, konferencije, vebinari...'],
            ['naziv' => 'Licno', 'opis' => 'Putovanja, doktorski pregledi, rodjenani, oklupljanja...'],
            ['naziv' => 'Obrazovanje', 'opis' => 'Predavanja, ispiti, seminari, casovi...'],
            ['naziv' => 'Sport', 'opis' => 'Treninzi, utakmice, turniri, maraton...'],
            ['naziv' => 'Kultura', 'opis' => 'Koncerti, izlozbe, predstave, bioskop...'],
            ['naziv' => 'Praznik', 'opis' => 'Praznici i religiozni dogadjaji.'],
            ['naziv' => 'Razno', 'opis' => 'Razni dogadjaji.'],
        ];

        foreach ($tipoviDogadjaja as $tip) {
            TipDogadjaja::create($tip);
        }
    }
}
