<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('manual'); // manual|shiprocket
            $table->string('provider_shipment_id')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('courier')->nullable();
            $table->string('status')->default('pending'); // pending|created|in_transit|delivered|failed|returned
            $table->unsignedInteger('shipping_paise')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['provider', 'tracking_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
