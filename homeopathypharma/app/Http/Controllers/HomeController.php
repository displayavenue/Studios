<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Brand;
use App\Models\Category;
use App\Models\DoctorProfile;
use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Services\SiteSettings;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __invoke(SiteSettings $settings): View
    {
        $sections = HomepageSection::query()
            ->published()
            ->orderBy('sort_order')
            ->get()
            ->keyBy('key');

        $homepageCategories = Category::query()
            ->published()
            ->where('show_on_homepage', true)
            ->with('image')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(10)
            ->get();

        $navCategories = Category::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(12)
            ->get();

        $homepageBrands = Brand::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(6)
            ->get();

        $featuredProducts = Product::query()
            ->published()
            ->where('is_featured', true)
            ->with(['images.media', 'brand'])
            ->latest('published_at')
            ->limit(8)
            ->get();

        $dealProducts = Product::query()
            ->published()
            ->whereNotNull('sale_price_paise')
            ->with(['images.media', 'brand'])
            ->orderBy('sale_price_paise')
            ->limit(8)
            ->get();

        $homepageDoctors = DoctorProfile::query()
            ->homepageFeatured()
            ->with('photo')
            ->limit(3)
            ->get();

        $homepageFounders = TeamMember::query()
            ->homepage()
            ->with('photo')
            ->limit(6)
            ->get();

        $homepageTestimonials = Testimonial::query()
            ->published()
            ->where('show_on_homepage', true)
            ->orderBy('sort_order')
            ->limit(6)
            ->get();

        $homepageBlog = Article::query()
            ->published()
            ->blog()
            ->where(function ($q) {
                $q->where('show_on_homepage', true)->orWhere('is_featured', true);
            })
            ->latest('published_at')
            ->limit(5)
            ->get();

        if ($homepageBlog->isEmpty()) {
            $homepageBlog = Article::query()
                ->published()
                ->blog()
                ->latest('published_at')
                ->limit(5)
                ->get();
        }

        return view('home.index', [
            'settings' => $settings,
            'sections' => $sections,
            'homepageCategories' => $homepageCategories,
            'navCategories' => $navCategories,
            'homepageBrands' => $homepageBrands,
            'featuredProducts' => $featuredProducts,
            'dealProducts' => $dealProducts,
            'homepageDoctors' => $homepageDoctors,
            'homepageFounders' => $homepageFounders,
            'homepageTestimonials' => $homepageTestimonials,
            'homepageBlog' => $homepageBlog,
        ]);
    }
}
