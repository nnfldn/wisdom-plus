<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Feature::updateOrCreate(['title' => 'Cloud Identity System'], [
            'icon' => 'ScanLine',
            'description' => 'Akses instan rekam medis dan histori pertumbuhan domba melalui sistem identifikasi berbasis cloud yang transparan.',
            'image_url' => 'https://images.unsplash.com/photo-1626243265882-628dceba727a?auto=format&fit=crop&w=600&q=80',
            'order' => 1,
            'is_active' => true,
        ]);

        Feature::updateOrCreate(['title' => 'Pedigree Certification'], [
            'icon' => 'ShieldCheck',
            'description' => 'Jaminan silsilah genetik untuk menjaga kualitas dan integritas bibit unggul bagi para peternak mitra.',
            'image_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80',
            'order' => 2,
            'is_active' => true,
        ]);

        Feature::updateOrCreate(['title' => 'Organic Bio-Fermented'], [
            'icon' => 'Target',
            'description' => 'Akselerasi bobot alami melalui formula pakan fermentasi organik yang mengedepankan kesehatan jangka panjang.',
            'image_url' => 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80',
            'order' => 3,
            'is_active' => true,
        ]);
    }
}
