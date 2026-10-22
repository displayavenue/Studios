<?php

use App\Http\Controllers\Account\AddressController;
use App\Http\Controllers\Account\AuthController as AccountAuthController;
use App\Http\Controllers\Account\OrderController as AccountOrderController;
use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\HomepageSectionController as AdminHomepageSectionController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\TeamMemberController as AdminTeamMemberController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentWebhookController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/category/{slug}', [ShopController::class, 'category'])->name('shop.category');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('/doctors', [DoctorController::class, 'index'])->name('doctors.index');
Route::get('/health-library', fn () => view('pages.health-library'))->name('health-library.index');
Route::get('/about', fn () => view('pages.about'))->name('about');
Route::get('/about/founders', function () {
    $members = TeamMember::query()->published()->orderBy('sort_order')->orderBy('name')->with('photo')->get();

    return view('pages.founders', compact('members'));
})->name('about.founders');

Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/cart', [CartController::class, 'show'])->name('cart');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/items/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/items/{item}', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/failed', [CheckoutController::class, 'failed'])->name('checkout.failed');
Route::post('/checkout/confirm-test', [CheckoutController::class, 'confirmTest'])->name('checkout.confirm-test');

Route::post('/webhooks/payments', PaymentWebhookController::class)->name('webhooks.payments');

Route::prefix('account')->name('account.')->group(function () {
    Route::get('/login', [AccountAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AccountAuthController::class, 'login'])->name('login.submit');
    Route::get('/register', [AccountAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AccountAuthController::class, 'register'])->name('register.submit');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AccountAuthController::class, 'logout'])->name('logout');
        Route::get('/', [ProfileController::class, 'dashboard'])->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/addresses', [AddressController::class, 'index'])->name('addresses');
        Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
        Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
        Route::get('/orders', [AccountOrderController::class, 'index'])->name('orders');
        Route::get('/orders/{order}', [AccountOrderController::class, 'show'])->name('orders.show');
    });
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::resource('products', AdminProductController::class)->except(['show']);
        Route::resource('categories', AdminCategoryController::class)->except(['show']);
        Route::resource('brands', AdminBrandController::class)->except(['show']);
        Route::resource('media', AdminMediaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('team', AdminTeamMemberController::class)->except(['show']);
        Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::put('orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');
        Route::get('homepage', [AdminHomepageSectionController::class, 'index'])->name('homepage.index');
        Route::get('homepage/{homepage}/edit', [AdminHomepageSectionController::class, 'edit'])->name('homepage.edit');
        Route::put('homepage/{homepage}', [AdminHomepageSectionController::class, 'update'])->name('homepage.update');
        Route::get('settings', [AdminSiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
    });
});
