<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_conversations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('visitor_name')->nullable();
            $table->string('visitor_phone')->nullable();
            $table->string('status', 20)->default('open'); // open|closed
            $table->boolean('lead_notified')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'last_message_at']);
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_conversation_id')->constrained('chat_conversations')->cascadeOnDelete();
            $table->string('sender', 20); // visitor|agent|system
            $table->text('body');
            $table->timestamps();

            $table->index(['chat_conversation_id', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_conversations');
    }
};
