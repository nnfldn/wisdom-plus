<?php

namespace Database\Seeders;

use App\Models\Stat;
use Illuminate\Database\Seeder;

class StatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Stat::updateOrCreate(['label' => 'Domba Terjual'], [
            'icon' => 'ShoppingBag',
            'value' => '1.5K+',
            'order' => 1,
            'is_active' => true,
        ]);

        Stat::updateOrCreate(['label' => 'Rekam Medis'], [
            'icon' => 'ShieldCheck',
            'value' => '100%',
            'order' => 2,
            'is_active' => true,
        ]);

        Stat::updateOrCreate(['label' => 'Virus & Wabah'], [
            'icon' => 'Activity',
            'value' => 'Zero',
            'order' => 3,
            'is_active' => true,
        ]);

        Stat::updateOrCreate(['label' => 'ADG Performa'], [
            'icon' => 'TrendingUp',
            'value' => '2.5x',
            'order' => 4,
            'is_active' => true,
        ]);
    }
}
