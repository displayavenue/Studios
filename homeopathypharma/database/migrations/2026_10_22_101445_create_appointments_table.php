<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('doctor_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('patient_name');
            $table->string('patient_phone', 30);
            $table->string('patient_email')->nullable();
            $table->string('consultation_mode'); // online|clinic
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('timezone')->default('Asia/Kolkata');
            $table->unsignedInteger('fee_paise')->nullable();
            $table->string('status')->default('pending'); // pending|confirmed|cancelled|completed|rescheduled
            $table->text('notes')->nullable();
            $table->boolean('terms_accepted')->default(false);
            $table->string('meeting_provider')->nullable();
            $table->string('meeting_url')->nullable();
            $table->text('meeting_access_token')->nullable(); // never expose publicly without auth
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();

            $table->unique(['doctor_profile_id', 'starts_at']);
            $table->index(['status', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
