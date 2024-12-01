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
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\BillsController;
use App\Http\Controllers\CartsController;
use App\Http\Controllers\PaymentController;

// public client
Route::get('/images/{filename}', [AuthController::class, 'getImage'])->middleware('guest');

Route::get('/products', [ProductsController::class, 'index'])->middleware('guest');

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

// Payment
Route::get('/payment/{id}', [PaymentController::class, 'payment'])->name('vn_payment');
Route::get('/payment/{id}/callback', [PaymentController::class, 'payment_callback'])->name('vn_payment_callback');

// middleware auth:sanctum
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth
    Route::get('/info', [AuthController::class, 'info']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications', [NotificationController::class, 'readNotification']);


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [CustomerController::class, 'updateInfo']);

    Route::get('/get-carts', [CustomerController::class, 'getCarts']);
    Route::post('/add-to-cart', [CustomerController::class, 'addToCart']);
    Route::put('/update-cart/{id}', [CustomerController::class, 'updateCart']);
    Route::delete('/remove-cart/{id}', [CustomerController::class, 'removeFromCart']);

});

Route::post('/forgot-password', [AuthController::class, 'forgot_Password'])
    ->middleware('guest')->name('password.email');

Route::post('/reset-password', [AuthController::class, 'reset_Password'])
    ->middleware('guest')->name('password.reset');

// get Products
Route::get('/get-products', [CustomerController::class, 'getProducts'])->middleware('guest');
Route::get('/get-product/{id}', [CustomerController::class, 'getProduct'])->middleware('guest');


// is Admin
Route::group(['middleware' => ['auth:sanctum', CheckIsAdminMiddleware::class]], routes: function () {
    Route::post('/send-notifications', [NotificationController::class, 'sendNotifications']);

    Route::resource('/users', UsersController::class);
    Route::resource('/categories', CategoriesController::class);
    Route::resource('/products', ProductsController::class);
    Route::resource('/image-products', ImageProductsController::class);
    Route::resource('/bills', BillsController::class);
    Route::resource('/carts', CartsController::class);

});

