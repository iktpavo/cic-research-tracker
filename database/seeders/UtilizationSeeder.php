<?php

namespace Database\Seeders;

use App\Models\Utilization;
use App\Models\Research;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UtilizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $researches = Research::all();

        foreach ($researches as $research) {
            // Only create a utilization if one doesn't already exist for this research.
            if (rand(0, 1) && ! $research->utilization()->exists()) {
                $research->utilization()->create(Utilization::factory()->make()->toArray());
            }
        }
    }
}
