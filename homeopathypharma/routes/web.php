<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\HomepageSectionController as AdminHomepageSectionController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\TeamMemberController as AdminTeamMemberController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HomeController;
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

Route::view('/cart', 'pages.placeholder', ['title' => 'Cart', 'message' => 'Cart will be available after checkout is configured in Phase 3.'])->name('cart');
Route::view('/account', 'pages.placeholder', ['title' => 'Account', 'message' => 'Customer accounts arrive in Phase 3.'])->name('account');

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
        Route::get('homepage', [AdminHomepageSectionController::class, 'index'])->name('homepage.index');
        Route::get('homepage/{homepage}/edit', [AdminHomepageSectionController::class, 'edit'])->name('homepage.edit');
        Route::put('homepage/{homepage}', [AdminHomepageSectionController::class, 'update'])->name('homepage.update');
        Route::get('settings', [AdminSiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
    });
});
