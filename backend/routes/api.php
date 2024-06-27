<?php

use App\Http\Controllers\TipDogadjajaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Tipovi Dogadjaja Routes
Route::get('/tipoviDogadjaja', [TipDogadjajaController::class, 'index']);
Route::post('/tipoviDogadjaja', [TipDogadjajaController::class, 'store']);
Route::put('/tipoviDogadjaja/{id}', [TipDogadjajaController::class, 'update']);
Route::delete('/tipoviDogadjaja/{id}', [TipDogadjajaController::class, 'destroy']);
