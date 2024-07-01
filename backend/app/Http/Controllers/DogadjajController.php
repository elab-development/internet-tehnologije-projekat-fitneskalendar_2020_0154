<?php

namespace App\Http\Controllers;

use App\Http\Resources\DogadjajResource;
use App\Models\Dogadjaj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DogadjajController extends Controller
{
    // public function index()
    // {
    //     $dogadjaji = Dogadjaj::with('korisnik', 'kategorija')->get();
    //     return DogadjajResource::collection($dogadjaji);
    // }
    public function index()  
    { 
        //dakle vraca nam sve dogadjaje koje je kreirao logovani korisnik
        //i sve dogadjaje koji su javni
        $idKorisnika = auth()->id();

        $dogadjaji = Dogadjaj::where(function ($query) use ($idKorisnika) {
                $query->where('idKorisnika', $idKorisnika)
                      ->orWhere('privatnost', false); 
            })->with('korisnik')->with('kategorija')
            ->get();

        return DogadjajResource::collection($dogadjaji);
    }
    public function sviDogadjaji(){
        $dogadjaji = Dogadjaj::with('korisnik', 'kategorija')->with('korisnik')->with('kategorija')->get();
        return DogadjajResource::collection($dogadjaji);
    }
    public function javni()
    {
        // $publicEvents = Dogadjaj::where('privatnost', false)->with('korisnik')->with('kategorija')->get();
        // return DogadjajResource::collection($publicEvents);
        $key = 'javni_dogadjaji';

        $publicEvents = Cache::remember($key, now()->addMinutes(10), function () {
            return Dogadjaj::where('privatnost', false)->with('korisnik')->with('kategorija')->get();
        });
    
        return DogadjajResource::collection($publicEvents);
    }
    public function show($id)
    {
        $dogadjaj = Dogadjaj::with('korisnik', 'kategorija')->findOrFail($id);
        return new DogadjajResource($dogadjaj);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'idTipaDogadjaja' => 'required|integer',
            //'idKorisnika' => 'required|integer',
            'naslov' => 'required|string|max:255',
            'datumVremeOd' => 'required|date',
            'datumVremeDo' => 'required|date|after:datumVremeOd',
            'opis' => 'nullable|string',
            'lokacija' => 'nullable|string|max:255',
            'privatnost' => 'required|boolean',
        ]);
        $userId = auth()->id();
        $validated['idKorisnika'] = $userId;
        $dogadjaj = Dogadjaj::create($validated);
        return new DogadjajResource($dogadjaj);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'idTipaDogadjaja' => 'required|integer',
            'idKorisnika' => 'required|integer',
            'naslov' => 'required|string|max:255',
            'datumVremeOd' => 'required|date',
            'datumVremeDo' => 'required|date|after:datumVremeOd',
            'opis' => 'nullable|string',
            'lokacija' => 'nullable|string|max:255',
            'privatnost' => 'required|boolean',
        ]);

        try {
            $dogadjaj = Dogadjaj::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Dogadjaj nije pronađen'], 404);
        }
        $dogadjaj->update($validated);
        return new DogadjajResource($dogadjaj);
    }

    public function destroy($id)
    {
        $dogadjaj = Dogadjaj::findOrFail($id);
        $dogadjaj->delete();
        return response()->json(['message' => 'Event successfully deleted'], 200);
    }
}


