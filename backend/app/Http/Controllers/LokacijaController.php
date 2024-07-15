<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class LokacijaController extends Controller
{
   
    public function vratiKoordinate($adresa)
    {
        $apiKey = env('LOCATION_API_KEY');
        $apiUrl = "https://api.geoapify.com/v1/geocode/search?text={$adresa}&apiKey={$apiKey}";

        try {
            $response = Http::withOptions(['verify' => false])->get($apiUrl);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['features'][0]['geometry']['coordinates'])) {
                    $coordinates = $data['features'][0]['geometry']['coordinates'];
                    return response()->json(['coordinates' => $coordinates]);
                } else {
                    return response()->json(['error' => 'Nije pronađen nijedan rezultat za datu adresu.'], 404);
                }
            } else {
                return response()->json(['error' => 'Došlo je do greške prilikom pozivanja geokodirajućeg servisa.'], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Došlo je do greške prilikom slanja zahteva ka geokodirajućem servisu.'], 500);
        }
    }
    }

