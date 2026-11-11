<?php

namespace Database\Seeders;

use App\Models\Hero;
use Illuminate\Database\Seeder;

class HeroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hero::updateOrCreate(
            ['title' => "Evolusi Genetik.<br/><span class='text-m3-primary italic'>Presisi Nutrisi.</span>"],
            [
                'subtitle' => 'Transformasi peternakan domba pedaging di Indramayu melalui ekosistem digital dan inovasi pakan organik.',
                'image_url' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
                'button_text' => 'Buka Katalog',
                'button_link' => '/catalog',
                'is_active' => true,
                'order' => 0,
            ]
        );

        Hero::updateOrCreate(
            ['title' => "Kualitas Bibit <span class='text-m3-primary italic'>Bersertifikat.</span>"],
            [
                'subtitle' => 'Kami menjamin silsilah genetik setiap domba untuk memastikan Anda mendapatkan bibit terbaik untuk investasi peternakan.',
                'image_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=1200&q=80',
                'button_text' => 'Lihat Silsilah',
                'button_link' => '/about',
                'is_active' => true,
                'order' => 1,
            ]
        );
    }
}
