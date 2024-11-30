<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProviderSocialiteController;
use App\Http\Middleware\CheckIsAdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ImageProductsController;

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

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/info', [AuthController::class, 'info']);
});

// auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// middleware auth:sanctum
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth
    Route::get('/info', [AuthController::class, 'info']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications', [NotificationController::class, 'readNotification']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/forgot-password', [AuthController::class, 'forgot_Password'])
    ->middleware('guest')->name('password.email');

Route::post('/reset-password', [AuthController::class, 'reset_Password'])
    ->middleware('guest')->name('password.reset');

// is Admin
Route::group(['middleware' => ['auth:sanctum', CheckIsAdminMiddleware::class]], routes: function () {
    Route::post('/send-notifications', [NotificationController::class, 'sendNotifications']);

    Route::resource('/users', UsersController::class);
    Route::resource('/categories', CategoriesController::class);
    Route::resource('/products', ProductsController::class);
    Route::resource('/image-products', ImageProductsController::class);

});

