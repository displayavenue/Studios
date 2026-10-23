<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->string('registration_number')->nullable()->after('designation');
            $table->string('expertise_summary')->nullable()->after('specializations');
            $table->boolean('show_on_homepage')->default(false)->after('status');
            $table->unsignedInteger('homepage_sort_order')->default(0)->after('show_on_homepage');
            $table->boolean('team_schedules_meet')->default(true)->after('homepage_sort_order');
            $table->index(['show_on_homepage', 'homepage_sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('doctor_profiles', function (Blueprint $table) {
            $table->dropIndex(['show_on_homepage', 'homepage_sort_order']);
            $table->dropColumn([
                'registration_number',
                'expertise_summary',
                'show_on_homepage',
                'homepage_sort_order',
                'team_schedules_meet',
            ]);
        });
    }
};
