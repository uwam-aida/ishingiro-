<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('name', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        if (!$user instanceof User) {
            return response()->json(['error' => 'Authenticated user is invalid'], 500);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function savePlayerId(Request $request)
    {
        $request->validate([
            'player_id' => 'required|string'
        ]);

        $user = auth()->user();
        $user->player_id = $request->player_id;
        $user->save();

        return response()->json(['status' => 'saved']);
    }
}
