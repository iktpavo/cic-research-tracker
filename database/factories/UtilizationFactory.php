<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Utilization;
use App\Models\Research;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Utilization>
 */
class UtilizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Utilization::class;

    public function definition(): array
    {
        return [
             'beneficiary' => $this->faker->company(),
            'cert_date' => $this->faker->date(),
            'certificate_of_utilization' => null,
        ];
    }
}
