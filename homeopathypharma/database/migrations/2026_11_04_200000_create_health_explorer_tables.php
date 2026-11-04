<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anatomy_systems', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status', 20)->default('published')->index();
            $table->timestamps();
        });

        Schema::create('anatomy_organs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->foreignId('anatomy_system_id')->nullable()->constrained('anatomy_systems')->nullOnDelete();
            $table->string('gender', 16)->default('both');
            $table->text('summary')->nullable();
            $table->text('function_text')->nullable();
            $table->longText('description')->nullable();
            $table->json('symptoms')->nullable();
            $table->json('causes')->nullable();
            $table->json('risk_factors')->nullable();
            $table->json('diagnostics')->nullable();
            $table->json('treatments')->nullable();
            $table->json('specialists')->nullable();
            $table->json('prevention')->nullable();
            $table->json('hotspots')->nullable();
            $table->json('related_slugs')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('anatomy_diseases', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('summary')->nullable();
            $table->json('symptoms')->nullable();
            $table->json('causes')->nullable();
            $table->json('treatments')->nullable();
            $table->json('specialists')->nullable();
            $table->json('organ_slugs')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->timestamps();
        });

        Schema::create('anatomy_mental_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('summary')->nullable();
            $table->json('symptoms')->nullable();
            $table->json('causes')->nullable();
            $table->json('treatments')->nullable();
            $table->json('support')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->timestamps();
        });

        Schema::create('anatomy_manufacturers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('website')->nullable();
            $table->timestamps();
        });

        Schema::create('anatomy_homeopathy_products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('ingredients')->nullable();
            $table->string('potency')->nullable();
            $table->foreignId('anatomy_manufacturer_id')->nullable()->constrained('anatomy_manufacturers')->nullOnDelete();
            $table->string('manufacturer_label')->nullable();
            $table->text('description')->nullable();
            $table->text('traditional_claims')->nullable();
            $table->text('evidence_status')->nullable();
            $table->text('safety_warnings')->nullable();
            $table->text('contraindications')->nullable();
            $table->string('image_path')->nullable();
            $table->json('organ_slugs')->nullable();
            $table->json('disease_slugs')->nullable();
            $table->json('mental_slugs')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anatomy_homeopathy_products');
        Schema::dropIfExists('anatomy_manufacturers');
        Schema::dropIfExists('anatomy_mental_conditions');
        Schema::dropIfExists('anatomy_diseases');
        Schema::dropIfExists('anatomy_organs');
        Schema::dropIfExists('anatomy_systems');
    }
};
