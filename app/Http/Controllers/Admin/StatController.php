<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StatRequest;
use App\Models\Sheep;
use App\Models\Stat;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StatController extends Controller
{
    use LogsActivity;

    public function index(): Response
    {
        return Inertia::render('Admin/Stats', [
            'stats_list' => Stat::orderBy('order', 'asc')->get(),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(StatRequest $request): RedirectResponse
    {
        $stat = Stat::create($request->validated());
        $this->logActivity('create', 'stat', $stat->id, "Menambah statistik baru: {$stat->label}");

        return redirect()->back()->with('success', 'Statistik ditambahkan.');
    }

    public function update(StatRequest $request, $id): RedirectResponse
    {
        $stat = Stat::findOrFail($id);
        $stat->update($request->validated());
        $this->logActivity('update', 'stat', $stat->id, "Memperbarui statistik: {$stat->label}");

        return redirect()->back()->with('success', 'Statistik diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $stat = Stat::findOrFail($id);
        $this->authorize('delete', $stat);

        $label = $stat->label;
        $stat->delete();
        $this->logActivity('delete', 'stat', $id, "Menghapus statistik: {$label}");

        return redirect()->back()->with('success', 'Statistik dihapus.');
    }
}
