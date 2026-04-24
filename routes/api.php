<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\BakerAssistantController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// LOGIN (must NOT be inside auth middleware)
Route::post('/login', [AuthController::class, 'login']);

// PASSWORD RESET (with code)
Route::post('/reset-password', [PasswordController::class, 'resetWithCode']);


/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Get logged-in user
    Route::get('/user', fn() => auth()->user());


    /*
    |--------------------------------------------------------------------------
    | Marketing Manager (FULL ACCESS)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:marketing_manager')->group(function () {

        Route::apiResource('products', ProductController::class);

        Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
        Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
    });


    /*
    |--------------------------------------------------------------------------
    | Store Keeper
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:store_keeper')->group(function () {
        Route::post('/stock/add', [StockController::class, 'addStock']);
        Route::post('/stock/reduce', [StockController::class, 'reduceStock']);
    });


    /*
    |--------------------------------------------------------------------------
    | Shop Managers
    |--------------------------------------------------------------------------
    */
    
    Route::middleware('role:shop_manager_kabuga')->group(function () {
    Route::post('/kabuga/orders', [OrderController::class, 'store'])
        ->defaults('location', 'kabuga');
    });

    Route::middleware('role:shop_manager_masaka')->group(function () {
        Route::post('/masaka/orders', [OrderController::class, 'store'])
            ->defaults('location', 'masaka');
    });


    /*
    |--------------------------------------------------------------------------
    | Baker Assistant
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:baker_assistant')->group(function () {
        Route::post('/baker/production', [BakerAssistantController::class, 'storeProduction']);
    });


    /*
    |--------------------------------------------------------------------------
    | Operations Manager
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:operations_manager')->group(function () {
        Route::get('/operations/overview', [OperationsController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | Sales Coordinator
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:sales_coordinator')->group(function () {
        Route::post('/sales/cake-order', [SalesController::class, 'storeCakeOrder']);
    });


    /*
    |--------------------------------------------------------------------------
    | Finance Chief
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:finance_chief')->group(function () {
        Route::post('/finance/revenue', [FinanceController::class, 'store']);
        Route::put('/finance/products/{product}', [ProductController::class, 'updatePrice']);
    });

    Route::middleware(['auth:sanctum', 'role:cicm'])->prefix('reports')->group(function () {

        // Combined report (ALL)
        Route::get('/combined', [ReportController::class, 'combined']);

        // Per shop
        Route::get('/kabuga', [ReportController::class, 'byLocation'])
            ->defaults('location', 'kabuga');

        Route::get('/masaka', [ReportController::class, 'byLocation'])
            ->defaults('location', 'masaka');

        // Detailed raw data
        Route::get('/detailed', [ReportController::class, 'detailed']);
    });

});