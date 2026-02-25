<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Research;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Research>
 */
class ResearchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Research::class;

    public function definition(): array
    {

        $status = $this->faker->randomElement(['completed', 'ongoing', 'terminated']);
        $isCompleted = $status === 'completed';

        return [
            'research_title' => $this->faker->sentence(3),

            'funding_source' => $this->faker->randomElement([
                'Internal Funding',
                'CHED Grant',
                'DOST-PCIEERD',
                'University Research Fund',
                'External Funding',
                null,
            ]),

            'collaborating_agency' => $this->faker->randomElement([
                'DepEd Region XI',
                'LGU Davao',
                'PSA',
                'CBA',
                'COE',
                'CAEC',
                null,
            ]),

            'type' => $this->faker->randomElement(['study', 'program', 'project']),
            'program' => $this->faker->randomElement(['BSIT', 'BLIS', 'BSCS']),
            'status' => $status,

            // proposal fields
            'start_date' => $this->faker->date(),
            'duration' => $this->faker->randomElement(['6 months', '12 months', '18 months', '24 months']),
            'estimated_budget' => $this->faker->randomFloat(2, 50000, 5000000),
            'special_order' => null, // uploads can be null

            // monitoring fields
            'budget_utilized' => $isCompleted ? $this->faker->randomFloat(2, 10000, 3000000) : null,
            'completion_percentage' => $isCompleted ? 100 : $this->faker->numberBetween(5, 90),
            'terminal_report' => $isCompleted ? null : null,
            'year_completed' => $isCompleted ? (string) $this->faker->numberBetween(2017, 2025) : null,

            // dost6ps fields
            'publication'           => $this->faker->optional()->sentence(6),
            'patent'                => $this->faker->optional()->sentence(6),
            'product'               => $this->faker->optional()->sentence(6),
            'people_service'        => $this->faker->optional()->sentence(6),
            'place_and_partnership' => $this->faker->optional()->sentence(6),
            'policy'                => $this->faker->optional()->sentence(6),


        ];
    }
}
