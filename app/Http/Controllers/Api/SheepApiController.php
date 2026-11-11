<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sheep;
use Illuminate\Http\Request;

use App\Http\Resources\SheepResource;

class SheepApiController extends Controller
{
    public function index(Request $request)
    {
        // 1. Inputs with defaults & security limits
        $status = $request->query('status');
        $sort = $request->query('sort', 'latest');
        $perPage = max(1, min((int) $request->query('per_page', 10), 50));
        
        $query = Sheep::query();
        
        // 2. Dynamic Sorting
        if ($sort === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }
        
        // 3. Status Validation (Security & Integrity)
        $allowedStatuses = ['Siap Jual', 'Anakan', 'Sakit', 'Hamil', 'Laktasi', 'Penggemukan', 'Sehat'];
        
        if ($status) {
            $requestedStatuses = array_map('trim', explode(',', $status));
            $validStatuses = array_intersect($allowedStatuses, $requestedStatuses);
            
            if (!empty($validStatuses)) {
                $query->whereIn('status', $validStatuses);
            }
        } else {
            // Default filter for public API
            $query->whereIn('status', ['Siap Jual', 'Anakan']);
        }
        
        // 4. Optimized Pagination
        $sheep = $query->simplePaginate($perPage);
        
        return SheepResource::collection($sheep)->additional([
            'status' => 'success'
        ]);
    }

    public function show($tag)
    {
        $sheep = Sheep::where('tag', $tag)->firstOrFail();
        
        return (new SheepResource($sheep))->additional([
            'status' => 'success'
        ]);
    }

    public function all(Request $request)
    {
        $perPage = max(1, min((int) $request->query('per_page', 100), 200));
        return response()->json(Sheep::pluck('tag'));
    }
}
