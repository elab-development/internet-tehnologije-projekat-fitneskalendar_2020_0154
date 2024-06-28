<?php

namespace App\Http\Controllers;

use App\Models\TipDogadjaja;
use Illuminate\Http\Request;

class TipDogadjajaController extends Controller
{
    public function index()
    {
        $eventTypes = TipDogadjaja::all();
        return response()->json($eventTypes);
    }

    public function store(Request $request)
    {
        if (!auth()->check()) {
            abort(401, 'Unauthorized');
        }
        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
        ]);

        $eventType = TipDogadjaja::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
        ]);

        return response()->json($eventType, 201);
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

        return response()->json($eventType);
    }

    public function destroy($id)
    {
        $eventType = TipDogadjaja::findOrFail($id);
        $eventType->delete();

        return response()->json(null, 204);
    }
}
