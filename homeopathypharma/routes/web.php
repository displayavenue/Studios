<?php

use App\Http\Controllers\Account\AddressController;
use App\Http\Controllers\Account\AuthController as AccountAuthController;
use App\Http\Controllers\Account\OrderController as AccountOrderController;
use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\ArticleCategoryController as AdminArticleCategoryController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\AuditLogController as AdminAuditLogController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ConsultationRequestController as AdminConsultationRequestController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\GalleryItemController as AdminGalleryItemController;
use App\Http\Controllers\Admin\HomepageSectionController as AdminHomepageSectionController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PolicyPageController as AdminPolicyPageController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\TeamMemberController as AdminTeamMemberController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ConsultController;
use App\Http\Controllers\ConsultationRequestController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HealthConditionController;
use App\Http\Controllers\HealthLibraryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentWebhookController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\ShopController;
use App\Models\Appointment;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/llms.txt', [HealthConditionController::class, 'llms'])->name('seo.llms');

Route::get('/conditions', [HealthConditionController::class, 'index'])->name('conditions.index');
Route::get('/conditions/{slug}', [HealthConditionController::class, 'show'])->name('conditions.show');

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/category/{slug}', [ShopController::class, 'category'])->name('shop.category');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('/doctors', [DoctorController::class, 'index'])->name('doctors.index');
Route::get('/doctors/{slug}', [DoctorController::class, 'show'])->name('doctors.show');
Route::get('/consult', ConsultController::class)->name('consult');
Route::get('/doctors/{slug}/book', [AppointmentController::class, 'create'])->name('appointments.create');
Route::post('/doctors/{slug}/book', [AppointmentController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('appointments.store');
Route::get('/appointments/{appointment}/confirmation', [AppointmentController::class, 'confirmation'])->name('appointments.confirmation');

Route::get('/health-library', [HealthLibraryController::class, 'index'])->name('health-library.index');
Route::get('/health-library/{slug}', [HealthLibraryController::class, 'show'])->name('health-library.show');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/gallery', GalleryController::class)->name('gallery');

Route::get('/doctors/{slug}/request', [ConsultationRequestController::class, 'create'])->name('consultations.create');
Route::post('/doctors/{slug}/request', [ConsultationRequestController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('consultations.store');
Route::get('/consultations/{consultation}/confirmation', [ConsultationRequestController::class, 'confirmation'])
    ->name('consultations.confirmation');

Route::get('/policies/{slug}', [PolicyController::class, 'show'])->name('policies.show');

Route::get('/about', fn () => view('pages.about'))->name('about');
Route::get('/about/founders', function () {
    $members = TeamMember::query()->published()->orderBy('sort_order')->orderBy('name')->with('photo')->get();

    return view('pages.founders', compact('members'));
})->name('about.founders');

Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('contact.store');

Route::get('/cart', [CartController::class, 'show'])->name('cart');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/items/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/items/{item}', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/failed', [CheckoutController::class, 'failed'])->name('checkout.failed');
Route::post('/checkout/confirm-test', [CheckoutController::class, 'confirmTest'])
    ->middleware('throttle:10,1')
    ->name('checkout.confirm-test');

Route::post('/webhooks/payments', PaymentWebhookController::class)->name('webhooks.payments');

Route::prefix('account')->name('account.')->group(function () {
    Route::get('/login', [AccountAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AccountAuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('login.submit');
    Route::get('/register', [AccountAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AccountAuthController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('register.submit');

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
        Route::get('/appointments', function () {
            $appointments = Appointment::query()
                ->where('user_id', auth()->id())
                ->with('doctor')
                ->latest('starts_at')
                ->paginate(10);

            return view('account.appointments', compact('appointments'));
        })->name('appointments');
    });
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login.submit');

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::resource('products', AdminProductController::class)->except(['show']);
        Route::resource('categories', AdminCategoryController::class)->except(['show']);
        Route::resource('brands', AdminBrandController::class)->except(['show']);
        Route::resource('media', AdminMediaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('team', AdminTeamMemberController::class)->except(['show']);
        Route::resource('doctors', AdminDoctorController::class)->except(['show']);
        Route::post('doctors/{doctor}/credentials', [AdminDoctorController::class, 'storeCredential'])->name('doctors.credentials.store');
        Route::post('doctors/{doctor}/availability', [AdminDoctorController::class, 'storeAvailability'])->name('doctors.availability.store');
        Route::post('doctors/{doctor}/leaves', [AdminDoctorController::class, 'storeLeave'])->name('doctors.leaves.store');
        Route::get('appointments', [AdminAppointmentController::class, 'index'])->name('appointments.index');
        Route::get('appointments/{appointment}', [AdminAppointmentController::class, 'show'])->name('appointments.show');
        Route::put('appointments/{appointment}', [AdminAppointmentController::class, 'update'])->name('appointments.update');
        Route::get('consultations', [AdminConsultationRequestController::class, 'index'])->name('consultations.index');
        Route::get('consultations/{consultation}', [AdminConsultationRequestController::class, 'show'])->name('consultations.show');
        Route::put('consultations/{consultation}', [AdminConsultationRequestController::class, 'update'])->name('consultations.update');
        Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::put('orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');

        Route::resource('articles', AdminArticleController::class)->except(['show']);
        Route::resource('article-categories', AdminArticleCategoryController::class)->except(['show']);
        Route::resource('testimonials', AdminTestimonialController::class)->except(['show']);
        Route::resource('gallery', AdminGalleryItemController::class)->except(['show']);
        Route::post('gallery/sync-instagram', [AdminGalleryItemController::class, 'syncInstagram'])->name('gallery.sync-instagram');
        Route::get('policies', [AdminPolicyPageController::class, 'index'])->name('policies.index');
        Route::get('policies/{policy}/edit', [AdminPolicyPageController::class, 'edit'])->name('policies.edit');
        Route::put('policies/{policy}', [AdminPolicyPageController::class, 'update'])->name('policies.update');
        Route::get('audit-logs', AdminAuditLogController::class)->name('audit-logs.index');
        Route::get('reports', AdminReportController::class)->name('reports.index');

        Route::get('homepage', [AdminHomepageSectionController::class, 'index'])->name('homepage.index');
        Route::get('homepage/{homepage}/edit', [AdminHomepageSectionController::class, 'edit'])->name('homepage.edit');
        Route::put('homepage/{homepage}', [AdminHomepageSectionController::class, 'update'])->name('homepage.update');
        Route::get('settings', [AdminSiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
    });
});
