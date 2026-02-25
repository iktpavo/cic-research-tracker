<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Publication;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $memberIds    = Member::pluck('id');
        $publications = Publication::all();

        // pick 3–5 random member authors for each publication
        // attach to pivot (avoids duplicates)
        foreach ($publications as $publication) {
            $assignedMembers = $memberIds->random(rand(3, 7));
            $publication->members()->syncWithoutDetaching($assignedMembers);
        }
    }
}
