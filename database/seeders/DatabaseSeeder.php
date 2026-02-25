<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Research;
use App\Models\Member;
use App\Models\Utilization;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        // Call the seeders
        $this->call([
            MemberSeeder::class, 
            ResearchSeeder::class, 
            TeamSeeder::class, 
            PublicationSeeder::class,
            AuthorSeeder::class,
            UtilizationSeeder::class,
        ]);
    }
}
