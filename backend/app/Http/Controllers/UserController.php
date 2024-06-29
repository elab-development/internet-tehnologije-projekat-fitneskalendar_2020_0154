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
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user,
        ]);
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
            'uloga' => 'ulogovan'
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

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
            'uloga' => 'sometimes|string' 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->only(['ime', 'prezime', 'email', 'password', 'uloga']);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json(new UserResource($user));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    public function updateSelf(Request $request)
    {
        $idKorisnika = auth()->id();
      //  return response()->json($idKorisnika, 400);
        $user = User::findOrFail($idKorisnika);

        $validator = Validator::make($request->all(), [
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->only(['ime', 'prezime', 'email', 'password']);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json(new UserResource($user));
    }

    public function deleteSelf(Request $request)
    {
        $idKorisnika = auth()->id();
        $user = User::findOrFail($idKorisnika);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->delete();

        return response()->json(['message' => 'You deleted your account successfully']);
    }
    
    }

