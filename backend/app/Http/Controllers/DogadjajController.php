<?php

namespace App\Http\Controllers;

use App\Http\Resources\DogadjajResource;
use App\Mail\NotifikacijaMail;
use App\Models\Dogadjaj;
use App\Models\Notifikacija;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

    public function sviDogadjaji()
    {
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
    public function korisnikoviDogadjaji()
    {
        $idKorisnika = auth()->id();
        $dogadjaji = Dogadjaj::where('idKorisnika', $idKorisnika)->with('korisnik')->with('kategorija')->get();

        return DogadjajResource::collection($dogadjaji);
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'naslov' => 'required|string|max:255',
                'datumVremeOd' => 'required|date',
                'datumVremeDo' => 'required|date|after:datumVremeOd',
                'opis' => 'nullable|string',
                'lokacija' => 'nullable|string|max:255',
                'privatnost' => 'required|boolean',
                'idTipaDogadjaja' => 'required|integer',
                'notifikacije' => 'nullable|array',
                'notifikacije.*.poruka' => 'required_with:notifikacije|string',
                'notifikacije.*.vremeSlanja' => 'required_with:notifikacije|date|after_or_equal:now',
            ]);

            $dogadjaj = null;

            DB::transaction(function () use ($request, &$dogadjaj) {
                $user = Auth::user();
                $dogadjaj = Dogadjaj::create([
                    'naslov' => $request->input('naslov'),
                    'datumVremeOd' => $request->input('datumVremeOd'),
                    'datumVremeDo' => $request->input('datumVremeDo'),
                    'opis' => $request->input('opis'),
                    'lokacija' => $request->input('lokacija'),
                    'privatnost' => $request->input('privatnost'),
                    'idTipaDogadjaja' => $request->input('idTipaDogadjaja'),
                    'idKorisnika' => $user->id,
                ]);

                if ($request->has('notifikacije')) {
                    foreach ($request->input('notifikacije') as $notifikacijaData) {
                        $notifikacija = Notifikacija::create([
                            'idDogadjaja' => $dogadjaj->id,
                            'poruka' => $notifikacijaData['poruka'],
                            'vremeSlanja' => $notifikacijaData['vremeSlanja'],
                            'email' => $user->email,
                        ]);
                    }
                }
            });

            return new DogadjajResource($dogadjaj);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Dogadjaj nije kreiran. Greška: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {

        try {
            $validated = $request->validate([
                'idTipaDogadjaja' => 'required|integer',
                'naslov' => 'required|string|max:255',
                'datumVremeOd' => 'required|date',
                'datumVremeDo' => 'required|date|after:datumVremeOd',
                'opis' => 'nullable|string',
                'lokacija' => 'nullable|string|max:255',
                'privatnost' => 'required|boolean',
                'notifikacije' => 'nullable|array',
                'notifikacije.*.poruka' => 'required_with:notifikacije|string',
                'notifikacije.*.vremeSlanja' => 'required_with:notifikacije|date|after_or_equal:now',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Podaci nisu validni: ' . $e->getMessage()], 422);
        }

        try {
            $dogadjaj = Dogadjaj::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Dogadjaj nije pronađen'], 404);
        }

        if ($dogadjaj->idKorisnika !== auth()->id()) {
            return response()->json(['message' => 'You do not have permission to update this event'], 403);
        }

        try {
            // DB::transaction(function () use ($request, $validated, $dogadjaj) {
            //     $dogadjaj->update($validated);
            //     Log::info($request);
            //     Notifikacija::where('idDogadjaja', $dogadjaj->id)->delete();

            //     if ($request->has('notifikacije')) {
            //         foreach ($request->input('notifikacije') as $notifikacijaData) {
            //             Notifikacija::create([
            //                 'idDogadjaja' => $dogadjaj->id,
            //                 'poruka' => $notifikacijaData['poruka'],
            //                 'vremeSlanja' => $notifikacijaData['vremeSlanja'],
            //             ]);
            //         }
            //     }
            // });
            DB::transaction(function () use ($request, $validated, $dogadjaj) {
                $dragAndDrop = $request->input('dragAndDrop', false);
                $originalDatumVremeOd = Carbon::parse($dogadjaj->datumVremeOd);
                $dogadjaj->update($validated);

                if ($dragAndDrop) {
                    //u slucaju da je dogadjaj izmenjen preko drag and drop-a

                    $noviDatumVremeOd = Carbon::parse($request->input('datumVremeOd'));

                    foreach ($dogadjaj->notifikacije as $notifikacija) {
                        $originalVremeSlanja = Carbon::parse($notifikacija->vremeSlanja);
                        $razlikaUminutima = $originalDatumVremeOd->diffInMinutes($originalVremeSlanja);

                        $novoVremeSlanja =  $noviDatumVremeOd->copy()->subMinutes($razlikaUminutima);

                        $notifikacija->update(['vremeSlanja' => $novoVremeSlanja]);
                    }
                } else {
                    $notifikacijeIzRequesta = $request->has('notifikacije') ? $request->input('notifikacije') : [];
                    $porukeIzRequesta = array_column($notifikacijeIzRequesta, 'poruka');

                    foreach ($dogadjaj->notifikacije as $notifikacija) {
                       
                        //ako se promeni dogadjaj preko obicne izmene, ali se izmeni datum dogadjaja
                        if (in_array($notifikacija->poruka, $porukeIzRequesta)) {
                            $originalnoVremeSlanja = Carbon::parse($notifikacija->vremeSlanja);
                            $razlikaUminutima = $originalDatumVremeOd->diffInMinutes($originalnoVremeSlanja);
                            $noviDatumVremeOd = Carbon::parse($dogadjaj->datumVremeOd);

                            $novoVremeSlanja = $noviDatumVremeOd->copy()->subMinutes($razlikaUminutima);

                            $notifikacija->update(['vremeSlanja' => $novoVremeSlanja]);
                        } else {
                            //ako korisnik stavi manje notifikacija nego sto je pre bilo
                            $notifikacija->delete();
                        }
                    }
                    // ako korisnik stavi vise notifikacija nego sto je pre bilo
                    foreach ($notifikacijeIzRequesta as $notifikacijaData) {
                        if (!Notifikacija::where('idDogadjaja', $dogadjaj->id)
                            ->where('poruka', $notifikacijaData['poruka'])
                            ->exists()) {
                            Notifikacija::create([
                                'idDogadjaja' => $dogadjaj->id,
                                'poruka' => $notifikacijaData['poruka'],
                                'vremeSlanja' => $notifikacijaData['vremeSlanja'],
                            ]);
                        }
                    }
                }

            });
        } catch (\Exception $e) {
            return response()->json(['error' => 'Dogadjaj nije ažuriran. Greška: ' . $e->getMessage()], 500);
        }

        return new DogadjajResource($dogadjaj);
    }


    // public function destroy($id)
    // {
    //     $dogadjaj = Dogadjaj::findOrFail($id);
    //     if ($dogadjaj->idKorisnika !== auth()->id()) {
    //         return response()->json(['message' => 'You do not have permission to delete this event'], 403);
    //     }
    //     $dogadjaj->delete();
    //     return response()->json(['message' => 'Event successfully deleted'], 200);
    // }
    public function destroy($id)
    {
        $dogadjaj = Dogadjaj::findOrFail($id);

        if (auth()->user()->uloga === 'admin' && !$dogadjaj->privatnost) {
            $dogadjaj->delete();
            return response()->json(['message' => 'Public event successfully deleted by admin'], 200);
        }

        if ($dogadjaj->idKorisnika === auth()->id()) {
            $dogadjaj->delete();
            return response()->json(['message' => 'Event successfully deleted'], 200);
        }

        return response()->json(['message' => 'You do not have permission to delete this event'], 403);
    }
    public function dogadjajiPoTipu($idTipaDogadjaja)
    {
        $idKorisnika = auth()->id();


        $dogadjaji = Dogadjaj::where(function ($query) use ($idKorisnika, $idTipaDogadjaja) {
            $query->where('idKorisnika', $idKorisnika)
                ->where('idTipaDogadjaja', $idTipaDogadjaja)
                ->orWhere(function ($query) use ($idTipaDogadjaja) {
                    $query->where('privatnost', false)
                        ->where('idTipaDogadjaja', $idTipaDogadjaja);
                });
        })
            ->with('korisnik')
            ->with('kategorija')
            ->get();

        return DogadjajResource::collection($dogadjaji);
    }
}
