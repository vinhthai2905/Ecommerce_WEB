<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;

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

Route::group(['prefix' => ''], function(){
    Route::get('/', [HomeController::class, 'index'])->name('home.index');
});



Route::group(['prefix' => 'admin'], function(){
    Route::get('/login', [AdminController::class, 'Login'])->name('admin.login');
    Route::post('/login', [AdminController::class, 'Authenticate']);
    Route::get('/register', [AdminController::class, 'Register'])->name('admin.register');
    Route::post('/register', [AdminController::class, 'Check_Register']);
});



// Route::get('admin/login', [AdminController::class, 'Login'])->name('admin.login');
// Route::post('admin/login', [AdminController::class, 'Authenticate']);

Route::group(['prefix' => 'admin', 'middleware' => 'auth'], function(){
    Route::get('/index', [AdminController::class, 'Index'])->name('admin.index');
});