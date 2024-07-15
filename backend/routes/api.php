<?php

use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\IcsController;
use App\Http\Controllers\NotifikacijaController;
use App\Http\Controllers\PrognozaController;
use App\Http\Controllers\TipDogadjajaController;
use App\Http\Controllers\LokacijaController;

use App\Http\Controllers\UserController;
use App\Http\Resources\TipDogadjajaResource;
use App\Models\Dogadjaj;
use App\Models\TipDogadjaja;
use App\Http\Controllers\WeatherController;
use App\Http\Resources\DogadjajResource;
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

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::get('/dogadjaji/javni', [DogadjajController::class, 'javni']);
Route::get('/prognoza/{lokacija}', [PrognozaController::class, 'vratiVreme']);
Route::get('/notifikacije', [NotifikacijaController::class, 'index']);
Route::get('/trenutnaLokacija', [PrognozaController::class, 'trenutnaLokacija']);
Route::get('/vratiKoordinate/{adresa}', [LokacijaController::class, 'vratiKoordinate']);

Route::middleware('auth:sanctum')->group(function () {
    //rute za prijavljene korisnike
    Route::get('/profile', function(Request $request) {
        return auth()->user();
    });
    Route::resource('dogadjaji', DogadjajController::class);
    Route::resource('tipoviDogadjaja', TipDogadjajaController::class);
    Route::get('/dogadjaji/poTipu/{idTipaDogadjaja}', [DogadjajController::class,'dogadjajiPoTipu']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::put('/users', [UserController::class, 'updateSelf']);
    Route::delete('/users', [UserController::class, 'deleteSelf']);
    // rute za admina
    Route::middleware('uloga:admin')->group(function () {
        Route::get('/sviDogadjaji',[DogadjajController::class,'sviDogadjaji']);
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});

