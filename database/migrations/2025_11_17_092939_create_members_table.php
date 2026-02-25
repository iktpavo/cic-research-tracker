S<?php

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
            Schema::create('members', function (Blueprint $table) {
                $table->id();
                $table->timestamps();

                // Basic Details (All new)
                $table->string('full_name', 48);
                $table->enum('rank', [
                    'Professor',
                    'Assistant Professor',
                    'Associate Professor',
                    'Instructor',
                    'Technical Staff',
                    'Administrative Aide',
                    'Technician',
                    'Student',
                    'Alumnus',
                    'Alumna',
                    'Other'
                ])->default('Instructor');
                $table->text('designation')->nullable();
                $table->enum('member_program', ['BSIT', 'BLIS', 'BSCS'])->nullable();
                $table->string('member_email', 120)->unique()->nullable();
                $table->string('orcid', 32)->nullable();
                $table->string('telephone', 24)->nullable();

                // Educational and Professional fields
                $table->text('educational_attainment')->nullable();
                $table->text('specialization')->nullable();
                $table->text('research_interest')->nullable();

                // Member Profile Photo
                $table->string('profile_photo')->nullable();

                // Grad School Checkbox
                $table->boolean('teaches_grad_school')->default(false);
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('members');
        }
    };
