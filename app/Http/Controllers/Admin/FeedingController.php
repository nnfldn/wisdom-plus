<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsSheep;
use App\Http\Controllers\Controller;
use App\Models\Sheep;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Stub controller untuk halaman feeding log.
 * TODO: tambah model FeedingLog (sheep_id, food_type, amount, fed_at) — saat ini
 * halaman hanya menampilkan daftar Sheep tanpa data pakan riil.
 */
class FeedingController extends Controller
{
    use TransformsSheep;

    public function index(): Response
    {
        return Inertia::render('Admin/FeedingLog', [
            'sheepData' => Sheep::latest()
                ->paginate(15)
                ->through(fn ($s) => $this->transformSheep($s)),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
        ]);
    }
}
