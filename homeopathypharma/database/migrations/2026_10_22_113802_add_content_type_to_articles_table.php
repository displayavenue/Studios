<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('content_type')->default('article')->after('slug'); // article|case_study|blog
            $table->boolean('show_on_homepage')->default(false)->after('is_featured');
            $table->index(['content_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['content_type', 'status']);
            $table->dropColumn(['content_type', 'show_on_homepage']);
        });
    }
};
