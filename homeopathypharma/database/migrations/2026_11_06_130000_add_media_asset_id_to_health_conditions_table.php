<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('health_conditions', function (Blueprint $table) {
            $table->foreignId('media_asset_id')
                ->nullable()
                ->after('category')
                ->constrained('media_assets')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('health_conditions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('media_asset_id');
        });
    }
};
