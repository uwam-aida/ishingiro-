<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
        ]);

        // Normalize input (handles spaces, underscores, case)
        $normalizedName = $this->normalizeName($request->name);

        //BEST APPROACH (requires normalized_name column)
        $user = User::where('normalized_name', $normalizedName)->first();

        //fallback (only if you did NOT add normalized_name column)
        /*
        $user = User::all()->first(function ($u) use ($normalizedName) {
            return $this->normalizeName($u->name) === $normalizedName;
        });
        */

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'logged out']);
    }

    public function savePlayerId(Request $request)
    {
        $request->validate([
            'player_id' => 'required|string'
        ]);

        $user = auth()->user();
        if (!$user instanceof User) {
            return response()->json(['error' => 'User not authenticated properly'], 401);
        }

        $user->update([
            'player_id' => $request->player_id
        ]);

        return response()->json(['status' => 'saved']);
    }

    /**
     * Normalize name for flexible login
     */
    private function normalizeName($name)
    {
        return strtolower(str_replace([' ', '_'], '', $name));
    }
}