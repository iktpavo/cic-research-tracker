<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Research;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $memberIds   = Member::pluck('id');
        $researches  = Research::all();

        // pick 3–5 random members for each research
        // attach to pivot (avoids duplicates)
        foreach ($researches as $research) {
            $assignedMembers = $memberIds->random(rand(3, 5));
            $research->members()->syncWithoutDetaching($assignedMembers);
        }
    }
}
