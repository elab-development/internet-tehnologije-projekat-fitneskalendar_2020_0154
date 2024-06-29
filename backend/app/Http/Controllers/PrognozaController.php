<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class PrognozaController extends Controller
{
    public function vratiVreme($grad)
    {
        $apiKey = env('OPENWEATHER_API_KEY');
        $response = Http::withOptions(['verify' => false])->get("https://api.openweathermap.org/data/2.5/weather?q={$grad}&appid={$apiKey}&units=metric");

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Unable to fetch weather data'], $response->status());
        }
    }
}
