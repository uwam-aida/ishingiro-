<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Http\Request;

class PasswordController extends Controller
{
    public function generateCode($userId)
    {
        $code = rand(100000, 999999);

        PasswordResetCode::create([
            'user_id' => $userId,
            'code' => $code,
            'expires_at' => now()->addMinutes(10)
        ]);

        return response()->json(['code' => $code]);
    }

    public function resetWithCode(Request $request)
    {
        $record = PasswordResetCode::where('user_id', $request->user_id)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return response()->json(['error' => 'Invalid code'], 400);
        }

        $user = User::find($request->user_id);
        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }

    public function adminReset(Request $request, $userId)
    {
        if (auth()->user()->role->name !== 'marketing_manager') {
            abort(403);
        }

        $user = User::find($userId);
        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed by marketing manager']);
    }
}