<?php

namespace App\Http\Controllers;

use App\Models\Notifikacija;
use Illuminate\Http\Request;

class NotifikacijaController extends Controller
{
    public function index()
    {
        $notifikacije = Notifikacija::all();
        return response()->json($notifikacije);
    }
}
