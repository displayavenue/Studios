<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->string('payment_status', 20)->default('unpaid')->after('fee_paise');
            $table->timestamp('paid_at')->nullable()->after('payment_status');
            $table->index('payment_status');
        });

        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            Schema::disableForeignKeyConstraints();

            // Rebuild via a differently named table so SQLite index names do not collide
            // with indexes that remain attached to the renamed original table.
            Schema::create('payments_rebuild', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id')->nullable();
                $table->unsignedBigInteger('consultation_request_id')->nullable();
                $table->string('provider')->default('razorpay');
                $table->string('provider_order_id')->nullable();
                $table->string('provider_payment_id')->nullable();
                $table->unsignedInteger('amount_paise');
                $table->string('currency', 3)->default('INR');
                $table->string('status')->default('created');
                $table->json('meta')->nullable();
                $table->timestamps();
            });

            $rows = DB::table('payments')->get();
            foreach ($rows as $row) {
                DB::table('payments_rebuild')->insert([
                    'id' => $row->id,
                    'order_id' => $row->order_id,
                    'consultation_request_id' => null,
                    'provider' => $row->provider,
                    'provider_order_id' => $row->provider_order_id,
                    'provider_payment_id' => $row->provider_payment_id,
                    'amount_paise' => $row->amount_paise,
                    'currency' => $row->currency,
                    'status' => $row->status,
                    'meta' => $row->meta,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ]);
            }

            Schema::drop('payments');
            Schema::rename('payments_rebuild', 'payments');

            Schema::table('payments', function (Blueprint $table) {
                $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
                $table->foreign('consultation_request_id')->references('id')->on('consultation_requests')->nullOnDelete();
                $table->index('provider_order_id');
                $table->unique('provider_payment_id');
            });

            Schema::enableForeignKeyConstraints();

            return;
        }

        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id')->nullable()->change();
            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
            $table->foreignId('consultation_request_id')
                ->nullable()
                ->after('order_id')
                ->constrained('consultation_requests')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            Schema::disableForeignKeyConstraints();
            Schema::rename('payments', 'payments_new');

            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->string('provider')->default('razorpay');
                $table->string('provider_order_id')->nullable()->index();
                $table->string('provider_payment_id')->nullable()->unique();
                $table->unsignedInteger('amount_paise');
                $table->string('currency', 3)->default('INR');
                $table->string('status')->default('created');
                $table->json('meta')->nullable();
                $table->timestamps();
            });

            $rows = DB::table('payments_new')->whereNotNull('order_id')->get();
            foreach ($rows as $row) {
                DB::table('payments')->insert([
                    'id' => $row->id,
                    'order_id' => $row->order_id,
                    'provider' => $row->provider,
                    'provider_order_id' => $row->provider_order_id,
                    'provider_payment_id' => $row->provider_payment_id,
                    'amount_paise' => $row->amount_paise,
                    'currency' => $row->currency,
                    'status' => $row->status,
                    'meta' => $row->meta,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ]);
            }

            Schema::drop('payments_new');
            Schema::enableForeignKeyConstraints();
        } else {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropConstrainedForeignId('consultation_request_id');
                $table->dropForeign(['order_id']);
            });
            Schema::table('payments', function (Blueprint $table) {
                $table->unsignedBigInteger('order_id')->nullable(false)->change();
                $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
            });
        }

        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropIndex(['payment_status']);
            $table->dropColumn(['payment_status', 'paid_at']);
        });
    }
};
