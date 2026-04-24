<?php

use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopManagerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('products', ProductController::class);
});

Route::middleware(['auth', 'role:marketing_manager'])->group(function () {
    //Route::get('/admin', [AdminController::class, 'index']);
});

Route::middleware(['auth', 'role:shop_manager'])->group(function () {
    Route::get('/shop', [ShopManagerController::class, 'index']);
});

//rest password
Route::middleware(['auth', 'role:marketing_manager'])->group(function () {
    Route::post('/generate-code/{userId}', [PasswordController::class, 'generateCode']);
    Route::post('/admin-reset/{userId}', [PasswordController::class, 'adminReset']);
});

Route::post('/reset-password', [PasswordController::class, 'resetWithCode']);

require __DIR__.'/auth.php';
