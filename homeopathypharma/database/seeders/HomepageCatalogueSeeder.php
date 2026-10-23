<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HomepageCatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFounders();
        $this->seedCategories();
        $this->seedBrandsAndProducts();
    }

    private function seedFounders(): void
    {
        $members = [
            [
                'slug' => 'founder',
                'name' => 'Akash Yadav',
                'designation' => 'Founder',
                'role_key' => 'founder',
                'sort_order' => 1,
                'biography' => 'Akash founded HOMEOPATHY PHARMA to make genuine homeopathic medicines and doctor guidance easy to access for every household — starting from Mira Road, Mumbai, and serving patients online across India.',
                'link_url' => null,
            ],
            [
                'slug' => 'co-founder',
                'name' => 'Poonam Yadav',
                'designation' => 'Co-founder',
                'role_key' => 'co_founder',
                'sort_order' => 2,
                'biography' => 'Poonam leads customer experience and community care at HOMEOPATHY PHARMA, ensuring every consult request and order feels personal, clear, and trustworthy.',
                'link_url' => null,
            ],
        ];

        foreach ($members as $row) {
            TeamMember::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    ...$row,
                    'status' => 'published',
                    'published_at' => now(),
                    'show_on_homepage' => true,
                ]
            );
        }
    }

    private function seedCategories(): void
    {
        $categories = [
            ['Head & Hair', 'head-hair', 1],
            ['Face & Skin', 'face-skin', 2],
            ['Digestive Health', 'digestive-health', 3],
            ['Women\'s Care', 'womens-care', 4],
            ['Child Care', 'child-care', 5],
            ['Respiratory Care', 'respiratory-care', 6],
            ['Joint & Bone', 'joint-bone', 7],
            ['Immunity', 'immunity', 8],
            ['Stress & Sleep', 'stress-sleep', 9],
            ['Men\'s Care', 'mens-care', 10],
        ];

        foreach ($categories as [$name, $slug, $order]) {
            Category::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => 'Shop homeopathic products related to '.$name.'.',
                    'status' => 'published',
                    'show_on_homepage' => true,
                    'sort_order' => $order,
                    'seo_title' => $name.' | HOMEOPATHY PHARMA',
                    'seo_description' => 'Explore '.$name.' essentials at HOMEOPATHY PHARMA.',
                ]
            );
        }
    }

    private function seedBrandsAndProducts(): void
    {
        $brands = [
            ['SBL', 'sbl', 'Trusted Indian homeopathic brand for everyday remedies.'],
            ['Dr. Reckeweg', 'dr-reckeweg', 'German quality. Global trust.'],
            ['Schwabe', 'schwabe', 'Classic homeopathic formulations for family care.'],
        ];

        $brandModels = [];
        foreach ($brands as $i => [$name, $slug, $desc]) {
            $brandModels[$slug] = Brand::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $desc,
                    'status' => 'published',
                    'sort_order' => $i + 1,
                ]
            );
        }

        $products = [
            ['SBL Arnica Montana 30C', 'sbl', 14900, 13400, '30 ml', true, false],
            ['SBL Calcarea Phosphorica 6X', 'sbl', 12900, 11600, '25 g', true, false],
            ['Dr. Reckeweg R1', 'dr-reckeweg', 29900, 26900, '22 ml', true, true],
            ['Dr. Reckeweg R16', 'dr-reckeweg', 28900, 24500, '22 ml', true, true],
            ['Schwabe Alpha-Coff', 'schwabe', 19900, 16900, '20 ml', true, true],
            ['SBL Nux Vomica 30C', 'sbl', 14900, null, '30 ml', true, false],
            ['Schwabe Damiaplant', 'schwabe', 34900, 27900, '30 ml', false, true],
            ['SBL Rhus Toxicodendron 30C', 'sbl', 14900, 13400, '30 ml', true, false],
        ];

        $catIds = Category::query()->pluck('id')->all();

        foreach ($products as $i => [$name, $brandSlug, $price, $sale, $pack, $featured, $deal]) {
            $product = Product::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'sku' => 'HP-'.strtoupper(Str::substr(Str::slug($name), 0, 12)).'-'.($i + 1),
                    'brand_id' => $brandModels[$brandSlug]->id,
                    'short_description' => 'Popular homeopathic medicine from '.$brandModels[$brandSlug]->name.'.',
                    'description' => $name.' is listed for educational catalogue display. Follow label directions and consult a qualified practitioner when needed.',
                    'price_paise' => $price,
                    'sale_price_paise' => $sale,
                    'sale_starts_at' => $sale ? now()->subDay() : null,
                    'sale_ends_at' => $sale ? now()->addMonths(3) : null,
                    'stock_qty' => 50,
                    'stock_status' => 'in_stock',
                    'package_size' => $pack,
                    'status' => 'published',
                    'is_featured' => $featured || $deal,
                    'published_at' => now()->subDays($i),
                    'seo_title' => $name.' | HOMEOPATHY PHARMA',
                    'seo_description' => 'Buy '.$name.' online at HOMEOPATHY PHARMA.',
                ]
            );

            if ($catIds !== []) {
                $product->categories()->syncWithoutDetaching([
                    $catIds[$i % count($catIds)],
                ]);
            }
        }
    }
}
