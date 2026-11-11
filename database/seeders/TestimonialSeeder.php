<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Testimonial::updateOrCreate(
            ['name' => 'H. Ahmad Subianto'],
            [
                'role' => 'Peternak Indukan',
                'text' => 'Silsilah domba dari WisDom+ sangat jelas. Indukan F2 Suffolk yang saya beli bulan lalu sudah beranak dengan sehat. Transparansi datanya luar biasa!',
                'is_active' => true,
            ]
        );

        Testimonial::updateOrCreate(
            ['name' => 'Dian Restoran Aqiqah'],
            [
                'role' => 'Usaha Aqiqah',
                'text' => 'Daging dombanya lebih padat dan tidak prengus, mungkin karena pakannya pakai limbah buah fermentasi. Klien aqiqah saya pada puas semua.',
                'is_active' => true,
            ]
        );

        Testimonial::updateOrCreate(
            ['name' => 'Investor Jabar'],
            [
                'role' => 'Mitra Bisnis',
                'text' => 'Sistem Cloud Identity mempermudah audit aset. Kami bisa scan di kandang dan langsung tahu umur serta estimasi nilainya secara akurat.',
                'is_active' => true,
            ]
        );
    }
}
