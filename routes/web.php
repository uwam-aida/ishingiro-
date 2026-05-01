<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Ishingiro Shop API',
        'timestamp' => now()->toIso8601String(),
    ]);
});