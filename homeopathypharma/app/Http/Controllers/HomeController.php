<?php

namespace App\Http\Controllers;

use App\Models\Article;
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
            ->limit(12)
            ->get();

        $featuredProducts = Product::query()
            ->published()
            ->where('is_featured', true)
            ->with(['images.media'])
            ->latest('published_at')
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

        $homepageCaseStudies = Article::query()
            ->published()
            ->caseStudies()
            ->where('show_on_homepage', true)
            ->latest('published_at')
            ->limit(20)
            ->get();

        $homepageBlog = Article::query()
            ->published()
            ->blog()
            ->where(function ($q) {
                $q->where('show_on_homepage', true)->orWhere('is_featured', true);
            })
            ->latest('published_at')
            ->limit(3)
            ->get();

        if ($homepageBlog->isEmpty()) {
            $homepageBlog = Article::query()
                ->published()
                ->blog()
                ->latest('published_at')
                ->limit(3)
                ->get();
        }

        return view('home.index', [
            'settings' => $settings,
            'sections' => $sections,
            'homepageCategories' => $homepageCategories,
            'featuredProducts' => $featuredProducts,
            'homepageDoctors' => $homepageDoctors,
            'homepageFounders' => $homepageFounders,
            'homepageTestimonials' => $homepageTestimonials,
            'homepageCaseStudies' => $homepageCaseStudies,
            'homepageBlog' => $homepageBlog,
        ]);
    }
}
