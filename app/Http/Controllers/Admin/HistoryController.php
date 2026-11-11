<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Sheep;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/History', [
            'logs' => ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate(20),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }
}
