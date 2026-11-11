<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InteractsWithSupabaseImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\HeroRequest;
use App\Models\Hero;
use App\Models\Sheep;
use App\Services\SupabaseStorageService;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    use InteractsWithSupabaseImages, LogsActivity;

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->bootSupabaseStorage($storageService);
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Heroes', [
            'heroes' => Hero::orderBy('order', 'asc')->get(),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(HeroRequest $request): RedirectResponse
    {
        $hero = Hero::create($this->buildPayload($request));
        $this->logActivity('create', 'hero', $hero->id, 'Menambah slider hero baru');

        return redirect()->back()->with('success', 'Slider ditambahkan.');
    }

    public function update(HeroRequest $request, $id): RedirectResponse
    {
        $hero = Hero::findOrFail($id);
        $payload = $this->buildPayload($request, $hero);

        $hero->update($payload);
        $this->logActivity('update', 'hero', $hero->id, "Memperbarui slider hero #{$hero->id}");

        return redirect()->back()->with('success', 'Slider diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $hero = Hero::findOrFail($id);
        $this->authorize('delete', $hero);

        $this->safeDeleteImage($hero->image_url);
        $hero->delete();

        $this->logActivity('delete', 'hero', $id, "Menghapus slider hero #{$id}");

        return redirect()->back()->with('success', 'Slider dihapus.');
    }

    /**
     * Susun payload Hero termasuk sanitasi judul dan upload gambar.
     */
    private function buildPayload(HeroRequest $request, ?Hero $existing = null): array
    {
        $validated = $request->validated();

        $data = collect($validated)
            ->only(['subtitle', 'button_text', 'button_link', 'order'])
            ->toArray();
        $data['is_active'] = $request->boolean('is_active');
        $data['show_scanner'] = $request->boolean('show_scanner');

        $safeTitleMain = htmlspecialchars($validated['title_main'], ENT_QUOTES, 'UTF-8');
        $safeTitleAccent = htmlspecialchars($validated['title_accent'] ?? '', ENT_QUOTES, 'UTF-8');
        $data['title'] = $safeTitleMain . "<br/><span class='text-m3-primary italic'>" . $safeTitleAccent . '</span>';

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'heroes', 'hero');
            if ($url) {
                if ($existing) {
                    $this->safeDeleteImage($existing->image_url);
                }
                $data['image_url'] = $url;
            }
        } elseif (! $existing && ! empty($validated['image_url'])) {
            $data['image_url'] = $validated['image_url'];
        }

        return $data;
    }
}
