<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.                          
     */
    public function up(): void
    {
        Schema::create('utilizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->unique()->constrained()->onDelete('cascade');
            $table->string('beneficiary', 100);
            $table->date('cert_date');
            $table->string('certificate_of_utilization', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilizations');
    }
};
