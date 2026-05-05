<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BakerAssistantController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\OperationsController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SalesController;
use App\Http\Controllers\Api\ShopManagerController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\StoreKeeperController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [PasswordController::class, 'resetWithCode']);


/*
|--------------------------------------------------------------------------
| PROTECTED
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn() => auth()->user());
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/save-player-id', [AuthController::class, 'savePlayerId']);

    // Any authenticated user can view products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | MARKETING MANAGER
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:marketing_manager')->group(function () {
        Route::get('/users', [AuthController::class, 'getAllUsers']);
        Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
        Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
        Route::post('/impersonate/{userId}', [AuthController::class, 'impersonate']);
    });


    /*
    |--------------------------------------------------------------------------
    | STORE KEEPER
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:store_keeper')->prefix('storekeeper')->group(function () {
        Route::get('/', [StoreKeeperController::class, 'index']);
        Route::post('/stock', [StoreKeeperController::class, 'store']);
        Route::put('/stock/{id}', [StoreKeeperController::class, 'update']);
        Route::post('/delivery', [StoreKeeperController::class, 'storeDelivery']);
        Route::post('/damage', [StoreKeeperController::class, 'storeDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | SHOP MANAGERS — Location-specific order posting
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:shop_manager_kabuga')->post('/orders/kabuga', [OrderController::class, 'store'])->defaults('location', 'kabuga');
    Route::middleware('role:shop_manager_masaka')->post('/orders/masaka', [OrderController::class, 'store'])->defaults('location', 'masaka');

    /*
    |--------------------------------------------------------------------------
    | SHOP MANAGERS — Shared routes (both kabuga & masaka)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:shop_manager_kabuga,shop_manager_masaka')->group(function () {
        Route::post('/shop/cake-orders', [ShopManagerController::class, 'storeCakeOrder']);
        Route::post('/shop/feedback', [ShopManagerController::class, 'storeFeedback']);
        Route::post('/shop/damages', [ShopManagerController::class, 'recordDamage']);

        Route::get('/stock/{location}', [StockController::class, 'byLocation']);
        Route::get('/orders/{location}', [OrderController::class, 'indexByLocation']);
        Route::get('/shop/cake-orders/{location}', [ShopManagerController::class, 'cakeOrdersByLocation']);
        Route::get('/shop/damages/{location}', [ShopManagerController::class, 'damagesByLocation']);
        Route::get('/factory/stock', [StockController::class, 'factoryStock']);
    });


    /*
    |--------------------------------------------------------------------------
    | BAKER ASSISTANT
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:baker_assistant')->prefix('baker')->group(function () {
        Route::get('/ingredients', [BakerAssistantController::class, 'index']);
        Route::post('/ingredients', [BakerAssistantController::class, 'storeIngredient']);
        Route::post('/production', [BakerAssistantController::class, 'storeProduction']);
        Route::post('/damage', [BakerAssistantController::class, 'storeDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | PRODUCTION MANAGER (formerly Operations)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:operations_manager')->prefix('production')->group(function () {
        Route::get('/summary', [OperationsController::class, 'summary']);
        Route::get('/details', [OperationsController::class, 'details']);

        Route::put('/stock/{id}', [OperationsController::class, 'updateStock']);
        Route::delete('/stock/{id}', [OperationsController::class, 'deleteStock']);

        Route::put('/production/{id}', [OperationsController::class, 'updateProduction']);
        Route::delete('/production/{id}', [OperationsController::class, 'deleteProduction']);

        Route::delete('/damage/{id}', [OperationsController::class, 'deleteDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | SALES COORDINATOR
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:sales_coordinator')->prefix('sales')->group(function () {
        Route::get('/dashboard', [SalesController::class, 'dashboard']);
        Route::get('/cake-orders', [SalesController::class, 'cakeOrders']);
        Route::post('/cake-order', [SalesController::class, 'storeCakeOrder']);
        Route::post('/messages', [SalesController::class, 'sendMessage']);
        Route::get('/targets', [SalesController::class, 'targets']);
        Route::post('/targets', [SalesController::class, 'storeTarget']);
    });


    /*
    |--------------------------------------------------------------------------
    | FINANCE CHIEF (CFO)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:finance_chief')->prefix('finance')->group(function () {
        Route::get('/', [FinanceController::class, 'index']);
        Route::post('/revenue', [FinanceController::class, 'store']);

        // Product CRUD (CFO owns pricing strategy)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Finance hub
        Route::get('/chart', [FinanceController::class, 'chart']);
        Route::get('/ledger', [FinanceController::class, 'ledger']);
        Route::get('/measured-products', [FinanceController::class, 'measuredProducts']);

        // Inventory
        Route::get('/inventory/measured', [FinanceController::class, 'inventoryMeasured']);
        Route::get('/inventory/baked', [FinanceController::class, 'inventoryBaked']);

        // Analytics
        Route::get('/analytics/summary', [FinanceController::class, 'analyticsSummary']);
        Route::get('/analytics/performance', [FinanceController::class, 'analyticsPerformance']);
        Route::get('/analytics/activities', [FinanceController::class, 'analyticsActivities']);
    });


    /*
    |--------------------------------------------------------------------------
    | CICM — Analytics & Reporting
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:cicm')->prefix('reports')->group(function () {
        Route::get('/combined', [ReportController::class, 'combined']);
        Route::get('/kabuga', [ReportController::class, 'byLocation'])->defaults('location', 'kabuga');
        Route::get('/masaka', [ReportController::class, 'byLocation'])->defaults('location', 'masaka');
        Route::get('/detailed', [ReportController::class, 'detailed']);
        Route::get('/revenue', [ReportController::class, 'revenue']);
    });

});