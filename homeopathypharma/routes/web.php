<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/doctors', [DoctorController::class, 'index'])->name('doctors.index');
Route::get('/health-library', fn () => view('pages.health-library'))->name('health-library.index');
Route::get('/about', fn () => view('pages.about'))->name('about');
Route::get('/about/founders', fn () => view('pages.founders'))->name('about.founders');

Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::view('/cart', 'pages.placeholder', ['title' => 'Cart', 'message' => 'Cart will be available after catalogue and checkout are configured.'])->name('cart');
Route::view('/account', 'pages.placeholder', ['title' => 'Account', 'message' => 'Customer accounts will be available in a later phase.'])->name('account');
