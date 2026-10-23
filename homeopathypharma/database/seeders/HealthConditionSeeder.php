<?php

namespace Database\Seeders;

use App\Models\HealthCondition;
use App\Services\HealthConditionCatalog;
use App\Services\HealthConditionContentBuilder;
use Illuminate\Database\Seeder;

class HealthConditionSeeder extends Seeder
{
    public function run(): void
    {
        $builder = new HealthConditionContentBuilder;
        $items = HealthConditionCatalog::all();

        foreach ($items as $index => $item) {
            $payload = $builder->build($item, $index + 1);
            HealthCondition::query()->updateOrCreate(
                ['slug' => $payload['slug']],
                $payload
            );
        }
    }
}
