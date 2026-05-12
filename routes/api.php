<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BakerAssistantController;
use App\Http\Controllers\Api\DistributionController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\NotificationController;
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
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('/read-all', [NotificationController::class, 'markAllRead']);
        Route::put('/{id}/read', [NotificationController::class, 'markRead']);
    });

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
        Route::get('/history', [StoreKeeperController::class, 'deliveryHistory']);
        Route::post('/damage', [StoreKeeperController::class, 'storeDamage']);
        Route::get('/damage', [StoreKeeperController::class, 'damages']);           // NEW
        Route::get('/production', [StoreKeeperController::class, 'productionLog']); // NEW
        Route::get('/requests', [StoreKeeperController::class, 'requests']);
        Route::get('/cake-orders', [StoreKeeperController::class, 'cakeOrders']);
        Route::get('/cake-requests', [StoreKeeperController::class, 'cakeRequests']);
        Route::post('/deliver', [StoreKeeperController::class, 'deliver']);
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
        Route::post('/shop/cake-orders', [ShopManagerController::class, 'storeCakeOrder']);     // updated — now validates all fields
        Route::put('/shop/cake-orders/{id}', [ShopManagerController::class, 'updateCakeOrder']); // NEW
        Route::put('/orders/{id}/receive', [ShopManagerController::class, 'receiveOrder']);       // NEW
        Route::post('/shop/feedback', [ShopManagerController::class, 'storeFeedback']);
        Route::post('/shop/damages', [ShopManagerController::class, 'recordDamage']);

        Route::get('/stock/{location}', [StockController::class, 'byLocation']);
        Route::get('/orders/{location}', [OrderController::class, 'indexByLocation']);
        Route::get('/shop/cake-orders/{location}', [ShopManagerController::class, 'cakeOrdersByLocation']);
        Route::get('/shop/damages/{location}', [ShopManagerController::class, 'damagesByLocation']);
        Route::get('/factory/stock', [StockController::class, 'factoryStock']);
        Route::get('/cake-orders', [ShopManagerController::class, 'cakeOrdersLocation']);
    });


    /*
    |--------------------------------------------------------------------------
    | BAKER ASSISTANT
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:baker_assistant')->prefix('baker')->group(function () {
        Route::get('/ingredients', [BakerAssistantController::class, 'index']);
        Route::post('/ingredients', [BakerAssistantController::class, 'storeIngredient']);
        Route::get('/production', [BakerAssistantController::class, 'productionHistory']);
        Route::post('/production', [BakerAssistantController::class, 'storeProduction']);
        Route::get('/damage', [BakerAssistantController::class, 'damageHistory']);
        Route::post('/damage', [BakerAssistantController::class, 'storeDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | PRODUCTION MANAGER
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:operations_manager')->prefix('production')->group(function () {
        Route::get('/summary', [OperationsController::class, 'summary']);
        Route::get('/details', [OperationsController::class, 'details']);

        Route::put('/stock/{id}', [OperationsController::class, 'updateStock']);
        Route::delete('/stock/{id}', [OperationsController::class, 'deleteStock']);

        Route::put('/production/{id}', [OperationsController::class, 'updateProduction']);
        Route::delete('/production/{id}', [OperationsController::class, 'deleteProduction']);

        Route::put('/distribution/{id}', [OperationsController::class, 'updateDistribution']);
        Route::delete('/distribution/{id}', [OperationsController::class, 'deleteDistribution']);

        Route::put('/delivery/{id}', [OperationsController::class, 'updateDelivery']);
        Route::delete('/delivery/{id}', [OperationsController::class, 'deleteDelivery']);

        Route::put('/orders/{id}', [OperationsController::class, 'updateOrder']);
        Route::delete('/orders/{id}', [OperationsController::class, 'deleteOrder']);

        Route::delete('/damage/{id}', [OperationsController::class, 'deleteDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | DISTRIBUTION
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:store_keeper,operations_manager,cicm,finance_chief')->group(function () {
        Route::post('/distribution', [DistributionController::class, 'store']);
        Route::get('/distribution', [DistributionController::class, 'index']);
        Route::get('/distribution/categories', [DistributionController::class, 'categories']);
    });


    /*
    |--------------------------------------------------------------------------
    | SALES COORDINATOR
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:sales_coordinator')->prefix('sales')->group(function () {
        Route::get('/dashboard', [SalesController::class, 'dashboard']);

        Route::get('/requests', [SalesController::class, 'requests']);
        Route::get('/baked', [SalesController::class, 'baked']);
        Route::get('/delivered', [SalesController::class, 'delivered']);
        Route::get('/stock', [SalesController::class, 'stock']);
        Route::get('/damaged', [SalesController::class, 'damaged']);
        Route::get('/history', [SalesController::class, 'history']);

        Route::get('/cake-orders', [SalesController::class, 'cakeOrders']);
        Route::post('/cake-order', [SalesController::class, 'storeCakeOrder']);

        Route::post('/messages', [SalesController::class, 'sendMessage']);

        Route::get('/targets', [SalesController::class, 'targets']);
        Route::post('/targets', [SalesController::class, 'storeTarget']);
        Route::put('/targets/{id}', [SalesController::class, 'updateTarget']);
        Route::delete('/targets/{id}', [SalesController::class, 'destroyTarget']);
    });


    /*
    |--------------------------------------------------------------------------
    | FINANCE CHIEF (CFO)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:finance_chief')->prefix('finance')->group(function () {
        Route::get('/', [FinanceController::class, 'index']);
        Route::post('/revenue', [FinanceController::class, 'store']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::get('/chart', [FinanceController::class, 'chart']);
        Route::get('/ledger', [FinanceController::class, 'ledger']);
        Route::get('/measured-products', [FinanceController::class, 'measuredProducts']);

        Route::get('/inventory/measured', [FinanceController::class, 'inventoryMeasured']);
        Route::get('/inventory/baked', [FinanceController::class, 'inventoryBaked']);

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