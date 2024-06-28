<?php

use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\TipDogadjajaController;
use App\Http\Controllers\UserController;
use App\Http\Resources\TipDogadjajaResource;
use App\Models\Dogadjaj;
use App\Models\TipDogadjaja;

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

// Route::get('/tipoviDogadjaja', [TipDogadjajaController::class, 'index']);

// Route::post('/tipoviDogadjaja', [TipDogadjajaController::class, 'store']);
// Route::put('/tipoviDogadjaja/{id}', [TipDogadjajaController::class, 'update']);
// Route::delete('/tipoviDogadjaja/{id}', [TipDogadjajaController::class, 'destroy']);
//Route::resource('tipoviDogadjaja', TipDogadjajaController::class);
//Route::resource('tipoviDogadjaja',TipDogadjajaController::class);
//Route::resource('dogadjaji',DogadjajController::class);
//Route::get('dogadjaji',[TipDogadjajaController::class,'index']);
//Route::get('/dogadjaji', [DogadjajController::class, 'index']);
//Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::get('/javni', [DogadjajController::class, 'javni']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        return auth()->user();
    });
   Route::resource('dogadjaji', DogadjajController::class);
    Route::resource('tipoviDogadjaja', TipDogadjajaController::class);
    Route::post('/logout', [UserController::class, 'logout']);
});


