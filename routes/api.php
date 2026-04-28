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
    | MARKETING MANAGER (FULL CONTROL)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:marketing_manager')->group(function () {
        Route::post('/api/products', [ProductController::class, 'store']);
        Route::put('/api/products/{id}', [ProductController::class, 'update']);
        Route::delete('/api/products/{id}', [ProductController::class, 'delete']);
        Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
        Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
    });


    /*
    |--------------------------------------------------------------------------
    | STORE KEEPER
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:store_keeper')->prefix('stock')->group(function () {

        Route::get('/', [StockController::class, 'index']);
        Route::post('/add', [StockController::class, 'addStock']);
        Route::post('/reduce', [StockController::class, 'reduceStock']);
    });


    /*
    |--------------------------------------------------------------------------
    | SHOP MANAGERS (SEPARATED)
    |--------------------------------------------------------------------------
    */
    Route::prefix('orders')->group(function () {

        Route::middleware('role:shop_manager_kabuga')->group(function () {
            Route::post('/kabuga', [OrderController::class, 'store'])->defaults('location', 'kabuga');
        });

        Route::middleware('role:shop_manager_masaka')->group(function () {
            Route::post('/masaka', [OrderController::class, 'store'])->defaults('location', 'masaka');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | SHOP MANAGERS
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:shop_manager_kabuga,shop_manager_masaka')->group(function () {
        Route::post('/shop/orders', [ShopManagerController::class, 'storeOrder']);
        Route::post('/shop/cake-orders', [ShopManagerController::class, 'storeCakeOrder']);
        Route::post('/shop/feedback', [ShopManagerController::class, 'storeFeedback']);
        Route::post('/shop/damages', [ShopManagerController::class, 'recordDamage']);
    });


    /*
    |--------------------------------------------------------------------------
    | BAKER ASSISTANT
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:baker_assistant')->prefix('baker')->group(function () {

        Route::post('/ingredients', [BakerAssistantController::class, 'storeIngredient']);
        Route::post('/production', [BakerAssistantController::class, 'storeProduction']);
        Route::post('/damage', [BakerAssistantController::class, 'storeDamage']);
        Route::get('/ingredients', [BakerAssistantController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | OPERATIONS MANAGER
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:operations_manager')->prefix('operations')->group(function () {

        Route::get('/', [OperationsController::class, 'index']);
        Route::put('/stock/{id}', [OperationsController::class, 'updateStock']);
        Route::put('/production/{id}', [OperationsController::class, 'updateProduction']);
    });


    /*
    |--------------------------------------------------------------------------
    | SALES COORDINATOR
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:sales_coordinator')->prefix('sales')->group(function () {

        Route::post('/cake-order', [SalesController::class, 'storeCakeOrder']);
        Route::get('/', [SalesController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | FINANCE CHIEF
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:finance_chief')->prefix('finance')->group(function () {

        Route::post('/revenue', [FinanceController::class, 'store']);
        Route::put('/products/{product}', [FinanceController::class, 'updatePrice']);
        Route::get('/', [FinanceController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | CICM (REPORTS)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:cicm')->prefix('reports')->group(function () {

        Route::get('/combined', [ReportController::class, 'combined']);
        Route::get('/kabuga', [ReportController::class, 'byLocation'])->defaults('location', 'kabuga');
        Route::get('/masaka', [ReportController::class, 'byLocation'])->defaults('location', 'masaka');
        Route::get('/detailed', [ReportController::class, 'detailed']);
    });

});