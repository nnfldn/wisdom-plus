<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsSheep;
use App\Http\Controllers\Controller;
use App\Models\BreedingRecord;
use App\Models\Sheep;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use TransformsSheep;

    public function index(): Response
    {
        return Inertia::render('Admin/AppDrawer', [
            'stats' => $this->getDashboardStats()['stats']
        ]);
    }

    public function menu(): Response
    {
        return $this->index();
    }

    public function overview(): Response
    {
        $stats = $this->getDashboardStats();
        $breedings = BreedingRecord::with(['male', 'female'])
            ->orderBy('mating_date', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', array_merge($stats, [
            'recentBreedings' => $breedings,
            'fullScreen' => true,
        ]));
    }

    private function getDashboardStats(): array
    {
        // 1. Optimize Population Trend (2 queries instead of 7)
        $startDate = Carbon::now()->subMonths(6)->startOfMonth();
        $baseCount = Sheep::where('created_at', '<', $startDate)->count();

        $driverName = DB::connection()->getDriverName();
        $monthExpression = $driverName === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "to_char(created_at, 'YYYY-MM')";

        $monthlyCounts = Sheep::where('created_at', '>=', $startDate)
            ->selectRaw("COUNT(*) as count, {$monthExpression} as month")
            ->groupBy('month')
            ->pluck('count', 'month');

        $months = collect(range(0, 6))->map(fn ($i) => Carbon::now()->subMonths(6 - $i));
        $cumulative = $baseCount;

        $populationTrend = $months->map(function (Carbon $monthDate) use (&$cumulative, $monthlyCounts) {
            $key = $monthDate->format('Y-m');
            $birthsInMonth = $monthlyCounts->get($key, 0);
            $cumulative += $birthsInMonth;

            return [
                'name' => $monthDate->format('M'),
                'total' => $cumulative,
                'target' => 70,
            ];
        });

        // 2. Optimized Totals
        $total = Sheep::count();
        $jantan = Sheep::where('gender', 'Jantan')->count();
        $betina = Sheep::where('gender', 'Betina')->count();
        $sakit = Sheep::where('status', 'Sakit')->count();
        $siapJual = Sheep::where('status', 'Siap Jual')->count();
        $hamil = Sheep::where('status', 'Hamil')->count();

        $stats = [
            'total' => $total,
            'jantan' => $jantan,
            'betina' => $betina,
            'sakit' => $sakit,
            'siapJual' => $siapJual,
            'hamil' => $hamil,
            'sakitCount' => $sakit,
            'estimasiAset' => Sheep::sum('price_per_kg') * 40, 
        ];

        // 3. Optimized Weight Trend (1 query)
        $weightTrend = Sheep::select('type as name', DB::raw('AVG(weight) as weight'))
            ->groupBy('type')
            ->get();

        return [
            'stats' => $stats,
            'populationTrend' => $populationTrend,
            'weightTrend' => $weightTrend,
        ];
    }
}
