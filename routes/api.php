<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    if (auth()->user()->role->name === 'marketing_manager') 
        {
        return $next($request); // bypass all restrictions
    }
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth', 'role:marketing_manager'])->group(function () {
    Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
    Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
});

Route::post('/reset-password', [PasswordController::class, 'resetWithCode']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
});

Route::middleware(['auth:sanctum'])->group(function () {

    // Marketing manager (FULL ACCESS)
    Route::middleware('role:marketing_manager')->group(function () {
        Route::apiResource('products', ProductController::class);
    });

    // Store Keeper (stock control)
    Route::middleware('role:store_keeper')->group(function () {
        Route::post('/stock/add', [StockController::class, 'addStock']);
    });

    // Shop managers (orders)
    Route::middleware('role:shop_manager_kabuga')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
    });

    Route::middleware('role:shop_manager_masaka')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
    });

});