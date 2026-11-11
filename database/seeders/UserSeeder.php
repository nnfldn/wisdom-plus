<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superPassword = (string) (env('SEED_SUPERADMIN_PASSWORD') ?: Str::random(16));
        $adminPassword = (string) (env('SEED_ADMIN_PASSWORD') ?: Str::random(16));

        User::updateOrCreate(
            ['email' => env('SEED_SUPERADMIN_EMAIL', 'superadmin@wisdomplus.id')],
            [
                'name' => 'Super Admin WisDom+',
                'password' => Hash::make($superPassword),
                'role' => 'super-admin',
            ]
        );

        User::updateOrCreate(
            ['email' => env('SEED_ADMIN_EMAIL', 'admin@wisdomplus.id')],
            [
                'name' => 'Budi Operator',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
            ]
        );

        if (! env('SEED_SUPERADMIN_PASSWORD') || ! env('SEED_ADMIN_PASSWORD')) {
            $this->command?->warn('SEED_*_PASSWORD env tidak diset. Password acak telah digunakan:');
            if (! env('SEED_SUPERADMIN_PASSWORD')) {
                $this->command?->warn("  superadmin: {$superPassword}");
            }
            if (! env('SEED_ADMIN_PASSWORD')) {
                $this->command?->warn("  admin     : {$adminPassword}");
            }
            $this->command?->warn('Simpan password di tempat aman dan rotasi setelah login pertama.');
        }
    }
}
