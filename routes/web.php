<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Ishingiro Shop API',
        'timestamp' => now()->toIso8601String(),
    ]);
});
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated'], 401);
})->name('login');