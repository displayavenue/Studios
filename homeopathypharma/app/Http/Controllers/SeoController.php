<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\DoctorProfile;
use App\Models\HealthCondition;
use App\Models\PolicyPage;
use App\Models\Product;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function robots(): Response
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Allow: /conditions',
            'Allow: /llms.txt',
            'Disallow: /admin',
            'Disallow: /account',
            'Disallow: /checkout',
            'Disallow: /cart',
            'Sitemap: '.url('/sitemap.xml'),
            '',
            'User-agent: GPTBot',
            'Allow: /',
            'Allow: /conditions',
            'Allow: /llms.txt',
            '',
            'User-agent: ChatGPT-User',
            'Allow: /',
            '',
            'User-agent: Google-Extended',
            'Allow: /',
            '',
            'User-agent: anthropic-ai',
            'Allow: /',
            '',
            'User-agent: ClaudeBot',
            'Allow: /',
            '',
            'User-agent: PerplexityBot',
            'Allow: /',
        ];

        return response(implode("\n", $lines)."\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }

    public function sitemap(): Response
    {
        $urls = [
            ['loc' => route('home'), 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => route('shop.index'), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('doctors.index'), 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => route('consult'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('health-library.index'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('blog.index'), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('conditions.index'), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => route('gallery'), 'changefreq' => 'daily', 'priority' => '0.5'],
            ['loc' => route('about'), 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => route('about.founders'), 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => route('contact.show'), 'changefreq' => 'monthly', 'priority' => '0.5'],
        ];

        foreach (Product::query()->published()->orderBy('id')->get(['slug', 'updated_at']) as $product) {
            $urls[] = [
                'loc' => route('product.show', $product->slug),
                'lastmod' => optional($product->updated_at)?->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        foreach (DoctorProfile::query()->publiclyListed()->orderBy('id')->get(['slug', 'updated_at']) as $doctor) {
            $urls[] = [
                'loc' => route('doctors.show', $doctor->slug),
                'lastmod' => optional($doctor->updated_at)?->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        }

        foreach (Article::query()->published()->orderBy('id')->get(['slug', 'updated_at', 'published_at']) as $article) {
            $urls[] = [
                'loc' => route('health-library.show', $article->slug),
                'lastmod' => optional($article->updated_at ?? $article->published_at)?->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        }

        foreach (PolicyPage::query()->published()->orderBy('id')->get(['slug', 'updated_at']) as $page) {
            $urls[] = [
                'loc' => route('policies.show', $page->slug),
                'lastmod' => optional($page->updated_at)?->toAtomString(),
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ];
        }

        foreach (HealthCondition::query()->indexed()->orderBy('id')->get(['slug', 'updated_at', 'published_at']) as $condition) {
            $urls[] = [
                'loc' => route('conditions.show', $condition->slug),
                'lastmod' => optional($condition->updated_at ?? $condition->published_at)?->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ];
        }

        $xml = view('seo.sitemap', compact('urls'))->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
