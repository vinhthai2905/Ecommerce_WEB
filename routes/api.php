<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ProviderSocialiteController;
use App\Http\Middleware\CheckIsAdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CategoriesController;

// public client
Route::get('/images/{filename}', [AuthController::class, 'getImage'])->middleware('guest');

// AUTH
// EMAIL Verification
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['auth:sanctum', 'signed'])
    ->name('verification.verify');
Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.resend');

// socialite
Route::get('/auth/{provider}', [ProviderSocialiteController::class, 'redirect'])->middleware('guest');
Route::get('/auth/{provider}/callback', [ProviderSocialiteController::class, 'callback']);

// auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// is Admin
Route::group(['middleware' => ['auth:sanctum', CheckIsAdminMiddleware::class]], routes: function () {

    Route::resource('/users', UsersController::class);
    Route::resource('/categories', CategoriesController::class);
    Route::resource('/products', ProductsController::class);
    Route::resource('/image-products', ImageProductsController::class);

});

