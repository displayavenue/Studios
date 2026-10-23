<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category', 80)->index();
            $table->string('image_url');
            $table->string('image_alt');
            $table->string('snippet', 320);
            $table->text('short_description');
            $table->longText('long_description');
            $table->json('faqs');
            $table->json('reviews');
            $table->unsignedTinyInteger('review_count')->default(10);
            $table->decimal('rating_average', 3, 2)->default(4.80);
            $table->string('seo_title');
            $table->string('seo_description', 320);
            $table->json('seo_keywords')->nullable();
            $table->boolean('is_indexed')->default(true);
            $table->string('status', 20)->default('published')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_conditions');
    }
};
