<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Distribution;
use App\Services\SupabaseStorageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistributionController extends Controller
{
    protected $storageService;

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    public function index()
    {
        $distributions = Distribution::with(['sale.customer'])->latest()->get();
        $today = now()->format('Y-m-d');

        return Inertia::render('Admin/Distributions/Index', [
            'distributions' => $distributions,
            'defaultDate' => $today,
            'fullScreen' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $distribution = Distribution::findOrFail($id);

        $request->validate([
            'delivery_date' => 'nullable|date',
            'driver_name' => 'nullable|string',
            'vehicle_plate' => 'nullable|string',
            'delivery_status' => 'required|string', // Persiapan, Di Jalan, Terkirim
            'proof_image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['delivery_date', 'driver_name', 'vehicle_plate', 'delivery_status']);
        $newUrl = null;

        if ($request->hasFile('proof_image')) {
            $newUrl = $this->storageService->uploadImage($request->file('proof_image'), 'distributions', 'proof');
            $data['proof_image_url'] = $newUrl;
        }

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();
            
            $oldUrl = $distribution->proof_image_url;
            $distribution->update($data);

            if ($newUrl && $oldUrl && $newUrl !== $oldUrl) {
                $this->storageService->deleteImage($oldUrl);
            }

            \Illuminate\Support\Facades\DB::commit();
            return redirect()->back()->with('success', 'Status pengiriman berhasil diperbarui.');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            if ($newUrl) {
                $this->storageService->deleteImage($newUrl);
            }
            throw $e;
        }
    }
}
