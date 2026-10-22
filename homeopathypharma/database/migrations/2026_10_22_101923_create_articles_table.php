<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->foreignId('cover_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->string('author_name')->nullable(); // only when confirmed
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('draft'); // draft|published|archived
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
