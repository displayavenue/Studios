<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->nullable()->unique();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            // Money stored as integer paise (INR minor units)
            $table->unsignedInteger('price_paise');
            $table->unsignedInteger('sale_price_paise')->nullable();
            $table->timestamp('sale_starts_at')->nullable();
            $table->timestamp('sale_ends_at')->nullable();
            $table->integer('stock_qty')->default(0);
            $table->string('stock_status')->default('in_stock'); // in_stock|out_of_stock|backorder
            $table->string('package_size')->nullable();
            $table->text('ingredients')->nullable();
            $table->text('directions')->nullable();
            $table->text('warnings')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('status')->default('draft'); // draft|published|archived
            $table->boolean('is_featured')->default(false);
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'is_featured']);
            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
