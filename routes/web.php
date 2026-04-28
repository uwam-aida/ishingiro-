<?php


use App\Http\Controllers\BakerAssistantController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', fn() => view('welcome'));

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboards (Role-based)
    |--------------------------------------------------------------------------
    */
    Route::get('/marketing/dashboard', fn() => view('dashboards.marketing'))->middleware('role:marketing_manager');

    Route::get('/shop/kabuga', fn() => view('dashboards.shop_kabuga'))->middleware('role:shop_manager_kabuga');
    Route::get('/shop/masaka', fn() => view('dashboards.shop_masaka'))->middleware('role:shop_manager_masaka');

    Route::get('/stock/dashboard', fn() => view('dashboards.store_keeper'))->middleware('role:store_keeper');

    Route::get('/baker/dashboard', fn() => view('dashboards.baker'))->middleware('role:baker_assistant');

    Route::get('/operations/dashboard', fn() => view('dashboards.operations'))->middleware('role:operations_manager');

    Route::get('/sales/dashboard', fn() => view('dashboards.sales'))->middleware('role:sales_coordinator');

    Route::get('/reports/dashboard', fn() => view('dashboards.reports'))->middleware('role:cicm');

    Route::get('/finance/dashboard', fn() => view('dashboards.finance'))->middleware('role:finance_chief');

    Route::get('/cicm/dashboard', fn() => view('dashboards.cicm'))->middleware('role:cicm');


    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });


    /*
    |--------------------------------------------------------------------------
    | Marketing Manager (FULL ACCESS)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:marketing_manager')->prefix('marketing')->group(function () {

        Route::resource('products', ProductController::class);

        Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
        Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
    });


    /*
    |--------------------------------------------------------------------------
    | Shop Managers
    |--------------------------------------------------------------------------
    */
    Route::prefix('shop')->group(function () {

        Route::middleware('role:shop_manager_kabuga')->group(function () {
            Route::post('/kabuga/orders', [OrderController::class, 'store']);
        });

        Route::middleware('role:shop_manager_masaka')->group(function () {
            Route::post('/masaka/orders', [OrderController::class, 'store']);
        });

    });


    /*
    |--------------------------------------------------------------------------
    | Store Keeper
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:store_keeper')->prefix('stock')->group(function () {
        Route::post('/add', [StockController::class, 'addStock']);
        Route::post('/reduce', [StockController::class, 'reduceStock']);
    });


    /*
    |--------------------------------------------------------------------------
    | Baker Assistant
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:baker_assistant')->prefix('baker')->group(function () {
        Route::post('/production', [BakerAssistantController::class, 'storeProduction']);
    });


    /*
    |--------------------------------------------------------------------------
    | Operations Manager
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:operations_manager')->prefix('operations')->group(function () {
        Route::get('/overview', [OperationsController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | Sales Coordinator
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:sales_coordinator')->prefix('sales')->group(function () {
        Route::post('/cake-order', [SalesController::class, 'storeCakeOrder']);
    });


    /*
    |--------------------------------------------------------------------------
    | Finance Chief
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:finance_chief')->prefix('finance')->group(function () {
        Route::post('/revenue', [FinanceController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'updatePrice']);
    });

    /*
    |--------------------------------------------------------------------------
    | cicm
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth', 'role:cicm'])->prefix('reports')->group(function () {

    Route::get('/combined', [ReportController::class, 'combined']);
    Route::get('/kabuga', [ReportController::class, 'byLocation'])->defaults('location', 'kabuga');
    Route::get('/masaka', [ReportController::class, 'byLocation'])->defaults('location', 'masaka');

});

});

/*
|--------------------------------------------------------------------------
| Password Reset (Code-based)
|--------------------------------------------------------------------------
*/
Route::post('/reset-password', [PasswordController::class, 'resetWithCode']);

/*
|--------------------------------------------------------------------------
| Auth scaffolding
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';