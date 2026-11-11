<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InteractsWithSupabaseImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\FeatureRequest;
use App\Models\Feature;
use App\Models\Sheep;
use App\Services\SupabaseStorageService;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    use InteractsWithSupabaseImages, LogsActivity;

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->bootSupabaseStorage($storageService);
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Features', [
            'features_list' => Feature::orderBy('order', 'asc')->get(),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(FeatureRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $data = collect($validated)->only(['icon', 'title', 'description', 'order'])->toArray();
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'features', 'feature');
            if ($url) {
                $data['image_url'] = $url;
            }
        } elseif (! empty($validated['image_url'])) {
            $data['image_url'] = $validated['image_url'];
        }

        $feature = Feature::create($data);
        $this->logActivity('create', 'feature', $feature->id, "Menambah fitur baru: {$feature->title}");

        return redirect()->back()->with('success', 'Fitur ditambahkan.');
    }

    public function update(FeatureRequest $request, $id): RedirectResponse
    {
        $feature = Feature::findOrFail($id);

        $validated = $request->validated();
        $data = collect($validated)->only(['icon', 'title', 'description', 'order'])->toArray();
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'features', 'feature');
            if ($url) {
                $this->safeDeleteImage($feature->image_url);
                $data['image_url'] = $url;
            }
        }

        $feature->update($data);
        $this->logActivity('update', 'feature', $feature->id, "Memperbarui fitur: {$feature->title}");

        return redirect()->back()->with('success', 'Fitur diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $feature = Feature::findOrFail($id);
        $this->authorize('delete', $feature);

        $title = $feature->title;
        $this->safeDeleteImage($feature->image_url);

        $feature->delete();
        $this->logActivity('delete', 'feature', $id, "Menghapus fitur: {$title}");

        return redirect()->back()->with('success', 'Fitur dihapus.');
    }
}
