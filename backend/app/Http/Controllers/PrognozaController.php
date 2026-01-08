<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class PrognozaController extends Controller
{
    public function vratiVreme($grad)
    {
        $apiKey = env('OPENWEATHER_API_KEY');
        $response = Http::withOptions(['verify' => false])->get("https://api.openweathermap.org/data/2.5/forecast?q={$grad}&appid={$apiKey}&units=metric");
    
        if ($response->successful()) {
            $forecastData = $response->json();
            $forecast = [];
            foreach ($forecastData['list'] as $item) {
                $timestamp = $item['dt'];
                $date = date('Y-m-d', $timestamp);
                $time = date('H:i:s', $timestamp);
                $forecast[$date][] = [
                    'time' => $time,
                    'temperature' => $item['main']['temp'],
                    'description' => $item['weather'][0]['description'],
                   'min_temperature' => $item['main']['temp_min'],
                    'max_temperature' => $item['main']['temp_max'],
                    'feels_like' => $item['main']['feels_like'],
                    'humidity' => $item['main']['humidity'],
                    'description' => $item['weather'][0]['description'],
                    'icon' => $item['weather'][0]['icon'],
                ];
            }
            return response()->json($forecast);
        } else {
            return response()->json(['error' => 'Unable to fetch weather forecast'], $response->status());
        }
    }
    public function trenutnaLokacija()
    {
        try {
            $response = Http::get('http://ipinfo.io/json');
            return $response->json();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve location'], 500);
        }
    }
    }

