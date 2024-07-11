<?php

namespace App\Http\Controllers;

use App\Http\Resources\TipDogadjajaResource;
use App\Models\TipDogadjaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TipDogadjajaController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $eventTypes = TipDogadjaja::where('idKorisnika', $user->id)
            ->orWhereNull('idKorisnika')
            ->get();
        return TipDogadjajaResource::collection($eventTypes);
    }

    public function store(Request $request)
    {

        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
        ]);

        $eventType = TipDogadjaja::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'idKorisnika' => auth()->id()
        ]);

        return new TipDogadjajaResource($eventType);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
        ]);

        $eventType = TipDogadjaja::findOrFail($id);
        $eventType->update([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
        ]);

        return new TipDogadjajaResource($eventType);
    }

    public function destroy($id)
    {
        $eventType = TipDogadjaja::findOrFail($id);
        $eventType->delete();

        return response()->json(['message' => 'Event type successfully deleted'], 200);
    }
}
