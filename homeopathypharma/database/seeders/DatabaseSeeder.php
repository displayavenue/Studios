<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Phase 1: verified business settings + homepage shell only.
        // Do not seed invented products, doctors, founders, reviews, or emails.
        $this->call([
            SiteSettingsSeeder::class,
            HomepageSectionSeeder::class,
            AdminUserSeeder::class,
            PolicyPageSeeder::class,
            HomepageContentSeeder::class,
            HealthConditionSeeder::class,
        ]);
    }
}
