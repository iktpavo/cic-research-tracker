<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Publication;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Publication>
 */
class PublicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'publication_title'   => $this->faker->sentence(6),
            'journal'             => $this->faker->words(3, true),
            'publication_year'    => (string) $this->faker->numberBetween(2017, 2025),
            'publication_program' => $this->faker->randomElement(['BSIT', 'BLIS', 'BSCS']),
            'isbn'                => $this->faker->isbn13(),
            'p-issn'              => $this->faker->numerify('####-####'),
            'e-issn'              => $this->faker->numerify('####-####'),
            'publisher'           => $this->faker->company(),
            'online_view'         => $this->faker->url(),
            'incentive_file'      => null, // optional file
            'product_file'        => null,
            'patent_file'         => null,
        ];
    }
}
