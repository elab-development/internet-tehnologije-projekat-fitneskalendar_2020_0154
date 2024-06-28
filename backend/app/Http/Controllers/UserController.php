<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        if (!$users) {
            return response()->json(['message' => 'Users not found'], 404);
        }      
       return UserResource::collection($users);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'ime' => $request->ime,
            'prezime' => $request->prezime,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'uloga' => 'prijavljeniKorisnik'
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token,'token_type'=>'Bearer']);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
    
        $user = User::where('email', $request['email'])->firstOrFail();
    
      //  dd($user);
        $token = $user->createToken('authToken')->plainTextToken;
    
        return response()->json(['user' => new UserResource($user), 'token' => $token]);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

}
