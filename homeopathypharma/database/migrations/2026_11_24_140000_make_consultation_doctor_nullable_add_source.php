<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('consultation_requests', 'source')) {
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->string('source', 60)->nullable()->after('status')->index();
            });
        }

        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            Schema::disableForeignKeyConstraints();

            Schema::create('consultation_requests_rebuild', function (Blueprint $table) {
                $table->id();
                $table->string('number')->unique();
                $table->unsignedBigInteger('doctor_profile_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('patient_name');
                $table->string('patient_phone', 30);
                $table->string('patient_email')->nullable();
                $table->text('concern')->nullable();
                $table->string('preferred_window')->nullable();
                $table->unsignedInteger('fee_paise')->default(99900);
                $table->string('payment_status', 20)->default('unpaid');
                $table->timestamp('paid_at')->nullable();
                $table->string('status')->default('pending');
                $table->string('source', 60)->nullable();
                $table->string('meeting_url')->nullable();
                $table->timestamp('scheduled_at')->nullable();
                $table->text('admin_notes')->nullable();
                $table->timestamps();
            });

            $rows = DB::table('consultation_requests')->get();
            foreach ($rows as $row) {
                DB::table('consultation_requests_rebuild')->insert([
                    'id' => $row->id,
                    'number' => $row->number,
                    'doctor_profile_id' => $row->doctor_profile_id,
                    'user_id' => $row->user_id,
                    'patient_name' => $row->patient_name,
                    'patient_phone' => $row->patient_phone,
                    'patient_email' => $row->patient_email,
                    'concern' => $row->concern,
                    'preferred_window' => $row->preferred_window,
                    'fee_paise' => $row->fee_paise,
                    'payment_status' => $row->payment_status ?? 'unpaid',
                    'paid_at' => $row->paid_at ?? null,
                    'status' => $row->status,
                    'source' => $row->source ?? null,
                    'meeting_url' => $row->meeting_url,
                    'scheduled_at' => $row->scheduled_at,
                    'admin_notes' => $row->admin_notes,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ]);
            }

            Schema::drop('consultation_requests');
            Schema::rename('consultation_requests_rebuild', 'consultation_requests');

            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->foreign('doctor_profile_id')->references('id')->on('doctor_profiles')->nullOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
                $table->index(['status', 'created_at']);
                $table->index('payment_status');
                $table->index('source');
            });

            Schema::enableForeignKeyConstraints();

            return;
        }

        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropForeign(['doctor_profile_id']);
        });
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('doctor_profile_id')->nullable()->change();
            $table->foreign('doctor_profile_id')->references('id')->on('doctor_profiles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Irreversible safely when null doctors exist.
    }
};
