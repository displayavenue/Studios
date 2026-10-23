<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('source')->default('manual'); // manual|instagram
            $table->string('external_id')->nullable()->index();
            $table->string('caption')->nullable();
            $table->string('media_type')->default('image'); // image|video|carousel
            $table->string('permalink')->nullable();
            $table->string('remote_media_url')->nullable();
            $table->foreignId('media_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->timestamp('posted_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('published'); // draft|published|archived
            $table->timestamps();

            $table->unique(['source', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
