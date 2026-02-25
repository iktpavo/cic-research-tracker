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
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('publication_title', 255);
            $table->string('journal', 255);
            $table->string('publication_year', 4);
            $table->enum('publication_program', ['BSIT', 'BLIS', 'BSCS'])->nullable();
            $table->string('isbn', 16)->nullable();
            $table->string('p-issn', 16)->nullable();
            $table->string('e-issn', 16)->nullable();
            $table->string('publisher', 120);
            $table->string('online_view', 255);
            $table->string('incentive_file', 120)->nullable();
            // product certificate, and patent certificate. NEW
            $table->string('product_file', 120)->nullable();
            $table->string('patent_file', 120)->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
