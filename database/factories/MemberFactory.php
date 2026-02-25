<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Member;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Member::class;

    public function definition(): array
    {
        return [

            // Basic Identity
            'full_name' => $this->faker->name(),

            'rank' => $this->faker->randomElement([
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
            ]),

            'designation' => $this->faker->optional()->jobTitle(),

            'member_program' => $this->faker->optional()->randomElement(['BSIT', 'BLIS', 'BSCS']),

            'member_email' => $this->faker->boolean(92) ? $this->faker->unique()->safeEmail() : null,

            'orcid' => $this->faker->optional(0.4)->numerify('0000-0002-####-####'),

            'telephone' => $this->faker->optional(0.7)->numerify('09##-###-####'),

            // Educational Fields
            'educational_attainment' => $this->faker->optional()->randomElement([
                'BSIT',
                'BLIS',
                'BSCS',
                'MSIT',
                'MSCS',
                'MLIS',
                'PhD in IT',
                'PhD in CS'
            ]),

            'specialization' => $this->faker->optional()->randomElement([
                'Cybersecurity',
                'AI & Data Science',
                'Software Engineering',
                'Web Development',
                'HCI',
                'Library Systems',
            ]),

            'research_interest' => $this->faker->optional()->sentence(6),

            // Nullable file upload
            'profile_photo' => null,

            // Boolean field (clean)
            'teaches_grad_school' => $this->faker->boolean(20),
        ];
    }
}
