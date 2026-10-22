<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('slug')->unique();
            $table->string('designation')->nullable(); // e.g. BHMS
            $table->foreignId('photo_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedInteger('years_experience')->nullable();
            $table->json('languages')->nullable();
            $table->json('specializations')->nullable();
            $table->json('consultation_modes')->nullable(); // online, clinic
            $table->unsignedInteger('fee_paise')->nullable();
            $table->string('city')->nullable();
            $table->string('locality')->nullable();
            $table->text('bio')->nullable();
            $table->string('verification_status')->default('unverified'); // unverified|pending|verified|rejected
            $table->timestamp('verified_at')->nullable();
            $table->string('status')->default('draft'); // draft|published|suspended|archived
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'verification_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_profiles');
    }
};
