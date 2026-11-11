<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\AboutSection;

class AboutSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AboutSection::updateOrCreate(
            ['key' => 'hero'],
            [
                'title' => 'Tentang <span class="text-m3-primary">WisDom+</span>',
                'subtitle' => 'Revolusi peternakan domba berawal dari kepedulian lingkungan dan keunggulan teknologi genetik.',
                'order' => 1,
                'is_active' => true,
            ]
        );

        AboutSection::updateOrCreate(
            ['key' => 'story'],
            [
                'title' => 'Membangun Standar Baru',
                'subtitle' => 'Kami percaya bahwa masa depan ketahanan pangan dimulai dari data yang presisi dan nutrisi yang berkelanjutan.',
                'content' => [
                    'description' => 'Didirikan pada tahun 2024 di Indramayu, WisDom+ hadir untuk memecahkan masalah klasik peternakan konvensional. Dengan mengintegrasikan sistem Cloud Identity, kami memastikan setiap ekor domba memiliki rekam medis digital yang transparan.',
                    'stats' => [
                        ['label' => 'Farm Terbaik', 'value' => 'No. 1'],
                        ['label' => 'Populasi Domba', 'value' => '500+']
                    ]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1541814674068-d05051932371?auto=format&fit=crop&w=800&q=80',
                'order' => 2,
                'is_active' => true,
            ]
        );

        AboutSection::updateOrCreate(
            ['key' => 'values'],
            [
                'title' => 'Nilai Inti Kami',
                'subtitle' => 'Prinsip yang menggerakkan setiap inovasi di WisDom+.',
                'content' => [
                    [
                        'icon' => 'ShieldCheck',
                        'title' => 'Integritas Genetik',
                        'desc' => 'Setiap bibit yang kami hasilkan memiliki sertifikasi silsilah yang jelas dan terverifikasi.'
                    ],
                    [
                        'icon' => 'Target',
                        'title' => 'Presisi Nutrisi',
                        'desc' => 'Optimasi pakan berbasis limbah organik yang difermentasi untuk performa pertumbuhan maksimal.'
                    ],
                    [
                        'icon' => 'Award',
                        'title' => 'Kesejahteraan Ternak',
                        'desc' => 'Manajemen kandang modern yang mengutamakan kenyamanan dan kesehatan alami domba.'
                    ]
                ],
                'order' => 3,
                'is_active' => true,
            ]
        );
    }
}
