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
}
