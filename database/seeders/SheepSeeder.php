<?php

namespace Database\Seeders;

use App\Models\Sheep;
use Illuminate\Database\Seeder;

class SheepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function up(): void
    {
        $sheepData = [
            [
                'tag' => 'QR-001',
                'type' => 'Cross Texel',
                'gender' => 'Jantan',
                'weight' => 45.5,
                'status' => 'Siap Jual',
                'price_per_kg' => 85000,
                'age_string' => '8 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Jantan Texel A (Super)',
                'parent_female' => 'Betina Garut B',
                'birth_date' => '2025-08-10',
                'img_url' => 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-002',
                'type' => 'F1 Texel',
                'gender' => 'Jantan',
                'weight' => 32.0,
                'status' => 'Penggemukan',
                'price_per_kg' => 90000,
                'age_string' => '5 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Jantan Texel Impor',
                'parent_female' => 'Betina Suffolk Lokal',
                'birth_date' => '2025-11-05',
                'img_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-003',
                'type' => 'F2 Suffolk',
                'gender' => 'Betina',
                'weight' => 15.2,
                'status' => 'Anakan',
                'price_per_kg' => 0,
                'age_string' => '2 Bulan',
                'block' => 'Ibu & Bayi',
                'health' => 'Sehat',
                'parent_male' => 'Jantan Suffolk C',
                'parent_female' => 'Betina Texel A',
                'birth_date' => '2026-02-15',
                'img_url' => 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-004',
                'type' => 'Garut Tangkas',
                'gender' => 'Jantan',
                'weight' => 38.0,
                'status' => 'Sakit',
                'price_per_kg' => 0,
                'age_string' => '7 Bulan',
                'block' => 'Karantina',
                'health' => 'Demam / PMK Gejala Awal',
                'parent_male' => 'Unknown',
                'parent_female' => 'Unknown',
                'birth_date' => '2025-09-20',
                'img_url' => 'https://images.unsplash.com/photo-1615809772186-b49dbb07baf0?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-005',
                'type' => 'Merino Pedaging',
                'gender' => 'Jantan',
                'weight' => 55.0,
                'status' => 'Siap Jual',
                'price_per_kg' => 95000,
                'age_string' => '10 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Jantan Merino A',
                'parent_female' => 'Betina Merino B',
                'birth_date' => '2025-06-01',
                'img_url' => 'https://images.unsplash.com/photo-1541814674068-d05051932371?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-006',
                'type' => 'Cross Texel Indukan',
                'gender' => 'Betina',
                'weight' => 42.0,
                'status' => 'Hamil',
                'price_per_kg' => 0,
                'age_string' => '12 Bulan',
                'block' => 'Blok Hamil',
                'health' => 'Sehat',
                'parent_male' => 'Jantan Texel A',
                'parent_female' => 'Betina Garut A',
                'birth_date' => '2025-04-10',
                'img_url' => 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-007',
                'type' => 'Lokal Super',
                'gender' => 'Betina',
                'weight' => 30.5,
                'status' => 'Penggemukan',
                'price_per_kg' => 75000,
                'age_string' => '4 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Lokal A',
                'parent_female' => 'Lokal B',
                'birth_date' => '2025-12-01',
                'img_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-008',
                'type' => 'Dorper Fullblood',
                'gender' => 'Jantan',
                'weight' => 65.2,
                'status' => 'Siap Jual',
                'price_per_kg' => 150000,
                'age_string' => '14 Bulan',
                'block' => 'Pejantan Unggul',
                'health' => 'Sehat',
                'parent_male' => 'Dorper Impor South Africa',
                'parent_female' => 'Dorper Grade A',
                'birth_date' => '2025-02-14',
                'img_url' => 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-009',
                'type' => 'Awassi Dairy',
                'gender' => 'Betina',
                'weight' => 48.0,
                'status' => 'Laktasi',
                'price_per_kg' => 0,
                'age_string' => '18 Bulan',
                'block' => 'Blok Perah',
                'health' => 'Sehat',
                'parent_male' => 'Awassi Male A',
                'parent_female' => 'Awassi Female B',
                'birth_date' => '2024-10-20',
                'img_url' => 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-010',
                'type' => 'Garut Aduan',
                'gender' => 'Jantan',
                'weight' => 52.5,
                'status' => 'Siap Jual',
                'price_per_kg' => 120000,
                'age_string' => '11 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Garut Jawara A',
                'parent_female' => 'Garut Induk B',
                'birth_date' => '2025-05-15',
                'img_url' => 'https://images.unsplash.com/photo-1615809772186-b49dbb07baf0?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-011',
                'type' => 'East Friesian Milk',
                'gender' => 'Jantan',
                'weight' => 12.5,
                'status' => 'Anakan',
                'price_per_kg' => 0,
                'age_string' => '1 Bulan',
                'block' => 'Ibu & Bayi',
                'health' => 'Sehat',
                'parent_male' => 'Friesian A',
                'parent_female' => 'Friesian B',
                'birth_date' => '2026-03-25',
                'img_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-012',
                'type' => 'Merino Wool Grade',
                'gender' => 'Betina',
                'weight' => 49.8,
                'status' => 'Penggemukan',
                'price_per_kg' => 80000,
                'age_string' => '6 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Kudis Ringan',
                'parent_male' => 'Merino Wool A',
                'parent_female' => 'Merino Wool B',
                'birth_date' => '2025-10-12',
                'img_url' => 'https://images.unsplash.com/photo-1541814674068-d05051932371?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-013',
                'type' => 'Suffolk Super',
                'gender' => 'Jantan',
                'weight' => 58.0,
                'status' => 'Siap Jual',
                'price_per_kg' => 110000,
                'age_string' => '9 Bulan',
                'block' => 'Penggemukan',
                'health' => 'Sehat',
                'parent_male' => 'Suffolk Jantan A',
                'parent_female' => 'Suffolk Betina B',
                'birth_date' => '2025-07-08',
                'img_url' => 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-014',
                'type' => 'Dorper Cross',
                'gender' => 'Betina',
                'weight' => 22.4,
                'status' => 'Penggemukan',
                'price_per_kg' => 0,
                'age_string' => '3 Bulan',
                'block' => 'Ibu & Bayi',
                'health' => 'Sehat',
                'parent_male' => 'Dorper Impor',
                'parent_female' => 'Lokal Super B',
                'birth_date' => '2026-01-05',
                'img_url' => 'https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=600&q=80'
            ],
            [
                'tag' => 'QR-015',
                'type' => 'Awassi Crossbreed',
                'gender' => 'Betina',
                'weight' => 40.2,
                'status' => 'Hamil',
                'price_per_kg' => 0,
                'age_string' => '16 Bulan',
                'block' => 'Blok Hamil',
                'health' => 'Sehat',
                'parent_male' => 'Awassi Jantan A',
                'parent_female' => 'Garut Induk A',
                'birth_date' => '2024-12-15',
                'img_url' => 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80'
            ]
        ];

        foreach ($sheepData as $data) {
            Sheep::updateOrCreate(
                ['tag' => $data['tag']],
                $data
            );
        }
    }

    public function run(): void
    {
        $this->up();
    }
}
