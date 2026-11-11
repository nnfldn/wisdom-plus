<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InteractsWithSupabaseImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\AboutSectionUpdateRequest;
use App\Models\AboutSection;
use App\Models\Sheep;
use App\Services\SupabaseStorageService;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AboutSectionController extends Controller
{
    use InteractsWithSupabaseImages, LogsActivity;

    private const ALLOWED_TAGS = '<br><b><i><strong><em><span><ul><li><ol><p>';

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->bootSupabaseStorage($storageService);
    }

    public function index(): Response
    {
        return Inertia::render('Admin/AboutManagement', [
            'sections' => AboutSection::orderBy('order', 'asc')->get(),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function update(AboutSectionUpdateRequest $request, $id): RedirectResponse
    {
        $section = AboutSection::findOrFail($id);
        $data = $request->validated();

        if (isset($data['title'])) {
            $data['title'] = strip_tags($data['title'], self::ALLOWED_TAGS);
        }
        if (isset($data['content']) && is_string($data['content'])) {
            $data['content'] = strip_tags($data['content'], self::ALLOWED_TAGS);
        }

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'about', 'about');
            if ($url) {
                $this->safeDeleteImage($section->image_url);
                $data['image_url'] = $url;
            }
        }

        $section->update($data);
        $this->logActivity('update', 'about', $section->id, "Memperbarui modul tentang kami: {$section->key}");

        return redirect()->back()->with('success', 'Bagian tentang diperbarui.');
    }
}
