<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);

        if (app()->environment('local', 'testing')) {
            $this->call([
                SheepSeeder::class,
                TestimonialSeeder::class,
                HeroSeeder::class,
                StatSeeder::class,
                FeatureSeeder::class,
            ]);
        }
    }
}
