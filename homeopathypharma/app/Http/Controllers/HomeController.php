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
use Illuminate\Support\Collection;
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
            ->get();

        $navCategories = Category::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $homepageBrands = Brand::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(6)
            ->get();

        // Mix brands on the homepage rails so every brand with picks can appear.
        $featuredProducts = $this->mixedBrandHighlightProducts('is_featured', 12);
        $dealProducts = $this->mixedBrandHighlightProducts('is_super_saving', 12);

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

    /**
     * Round-robin Popular / Super Saving picks across published brands
     * so one large catalogue cannot dominate the homepage rail.
     *
     * @return Collection<int, Product>
     */
    private function mixedBrandHighlightProducts(string $flagColumn, int $limit): Collection
    {
        if (! in_array($flagColumn, ['is_featured', 'is_super_saving'], true) || $limit <= 0) {
            return collect();
        }

        $brandIds = Brand::query()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->pluck('id');

        if ($brandIds->isEmpty()) {
            return Product::query()
                ->published()
                ->where($flagColumn, true)
                ->with(['images.media', 'brand'])
                ->latest('published_at')
                ->limit($limit)
                ->get();
        }

        /** @var array<int, Collection<int, Product>> $queues */
        $queues = [];
        foreach ($brandIds as $brandId) {
            $queues[(int) $brandId] = Product::query()
                ->published()
                ->where('brand_id', $brandId)
                ->where($flagColumn, true)
                ->with(['images.media', 'brand'])
                ->latest('published_at')
                ->get();
        }

        $picked = collect();
        while ($picked->count() < $limit) {
            $added = false;
            foreach ($queues as $brandId => $list) {
                if ($list->isEmpty()) {
                    continue;
                }
                $picked->push($list->shift());
                $added = true;
                if ($picked->count() >= $limit) {
                    break;
                }
            }
            if (! $added) {
                break;
            }
        }

        return $picked->values();
    }
}
