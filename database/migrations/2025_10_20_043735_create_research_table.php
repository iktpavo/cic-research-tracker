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
        Schema::create('research', function (Blueprint $table) {
            $table->id();
            // Partial entities
            $table->string('research_title');
            $table->string('funding_source')->nullable();
            $table->string('collaborating_agency')->nullable();
            $table->enum('type', ['study', 'program', 'project'])->default('study');
            $table->enum('program', ['BSIT', 'BLIS', 'BSCS'])->default('BSIT');
            $table->enum('status', ['completed', 'ongoing', 'terminated'])->default('ongoing');

            // Proposal Fields (New)
            $table->date('start_date')->nullable();
            $table->string('duration')->nullable();
            $table->decimal('estimated_budget', 12, 2)->nullable();
            $table->string('special_order', 120)->nullable();

            // Monitoring Fields (New)
            $table->decimal('budget_utilized', 12, 2)->nullable();
            $table->unsignedTinyInteger('completion_percentage')->default(0)->nullable();
            $table->string('terminal_report', 96)->nullable();
            $table->string('year_completed', 120)->nullable();

            //Dost 6ps (new)
            $table->text('publication')->nullable();
            $table->text('patent')->nullable();
            $table->text('product')->nullable();
            $table->text('people_service')->nullable();
            $table->text('place_and_partnership')->nullable();
            $table->text('policy')->nullable();

            $table->timestamps();
        });
    }
    // can add more fields, see se1 schema
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research');
    }
};
