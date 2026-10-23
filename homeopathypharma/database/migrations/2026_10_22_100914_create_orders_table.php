<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone', 30);
            $table->string('customer_email')->nullable();
            $table->string('shipping_line1');
            $table->string('shipping_line2')->nullable();
            $table->string('shipping_city');
            $table->string('shipping_state');
            $table->string('shipping_postal_code', 20);
            $table->string('shipping_country', 2)->default('IN');
            $table->text('notes')->nullable();
            $table->string('currency', 3)->default('INR');
            $table->unsignedInteger('subtotal_paise')->default(0);
            $table->unsignedInteger('shipping_paise')->default(0);
            $table->unsignedInteger('tax_paise')->default(0);
            $table->unsignedInteger('total_paise')->default(0);
            $table->string('payment_status')->default('pending'); // pending|paid|failed|refunded
            $table->string('fulfilment_status')->default('unfulfilled'); // unfulfilled|processing|shipped|delivered|cancelled
            $table->string('idempotency_key')->nullable()->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['payment_status', 'fulfilment_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
