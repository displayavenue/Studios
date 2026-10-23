<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultation_requests', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('doctor_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('patient_name');
            $table->string('patient_phone', 30);
            $table->string('patient_email')->nullable();
            $table->text('concern')->nullable();
            $table->string('preferred_window')->nullable();
            $table->unsignedInteger('fee_paise')->default(99900);
            $table->string('status')->default('pending'); // pending|contacted|scheduled|completed|cancelled
            $table->string('meeting_url')->nullable(); // Google Meet — filled by team
            $table->timestamp('scheduled_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultation_requests');
    }
};
