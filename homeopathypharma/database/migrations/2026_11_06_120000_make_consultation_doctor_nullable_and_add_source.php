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
                $table->string('source', 60)->nullable()->index();
            });
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->dropForeign(['doctor_profile_id']);
            });
            DB::statement('ALTER TABLE consultation_requests MODIFY doctor_profile_id BIGINT UNSIGNED NULL');
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->foreign('doctor_profile_id')
                    ->references('id')
                    ->on('doctor_profiles')
                    ->nullOnDelete();
            });

            return;
        }

        if ($driver === 'sqlite') {
            $rows = DB::table('consultation_requests')->get()->map(fn ($row) => (array) $row)->all();
            Schema::drop('consultation_requests');

            Schema::create('consultation_requests', function (Blueprint $table) {
                $table->id();
                $table->string('number')->unique();
                $table->foreignId('doctor_profile_id')->nullable()->constrained('doctor_profiles')->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('patient_name');
                $table->string('patient_phone', 30);
                $table->string('patient_email')->nullable();
                $table->text('concern')->nullable();
                $table->string('preferred_window')->nullable();
                $table->unsignedInteger('fee_paise')->default(99900);
                $table->string('status')->default('pending');
                $table->string('source', 60)->nullable()->index();
                $table->string('meeting_url')->nullable();
                $table->timestamp('scheduled_at')->nullable();
                $table->text('admin_notes')->nullable();
                $table->timestamps();
                $table->index(['status', 'created_at']);
            });

            foreach ($rows as $row) {
                if (! array_key_exists('source', $row)) {
                    $row['source'] = null;
                }
                DB::table('consultation_requests')->insert($row);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('consultation_requests', 'source')) {
            Schema::table('consultation_requests', function (Blueprint $table) {
                $table->dropColumn('source');
            });
        }
    }
};
