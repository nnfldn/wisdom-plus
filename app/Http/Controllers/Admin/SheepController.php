<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InteractsWithSupabaseImages;
use App\Http\Controllers\Admin\Concerns\TransformsSheep;
use App\Http\Controllers\Controller;
use App\Http\Requests\SheepStoreRequest;
use App\Http\Requests\SheepUpdateRequest;
use App\Models\Sheep;
use App\Services\SupabaseStorageService;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class SheepController extends Controller
{
    use InteractsWithSupabaseImages, LogsActivity, TransformsSheep;

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->bootSupabaseStorage($storageService);
    }

    public function index(): Response
    {
        $paginatedSheep = Sheep::latest()->paginate(15);

        return Inertia::render('Admin/SheepData', [
            'sheepData' => $paginatedSheep->through(fn ($s) => $this->transformSheep($s)),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(SheepStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imgUrl = $request->input('img');

        if ($request->hasFile('imgFile')) {
            $imgUrl = $this->safeUploadImage($request->file('imgFile'), 'sheep', $validated['tag']) ?? $imgUrl;
        }

        try {
            DB::beginTransaction();
            
            $sheep = Sheep::create([
                'tag' => $validated['tag'],
                'type' => $validated['type'],
                'gender' => $validated['gender'],
                'weight' => $validated['weight'],
                'birth_date' => $validated['birth_date'],
                'status' => $validated['status'],
                'block' => $validated['block'],
                'price_per_kg' => $validated['price_per_kg'] ?? 0,
                'age_string' => $validated['age'] ?? 'Baru',
                'health' => $validated['health'] ?? 'Sehat',
                'parent_male' => $validated['parent_male'] ?? null,
                'parent_female' => $validated['parent_female'] ?? null,
                'img_url' => $imgUrl,
            ]);

            $this->logActivity('create', 'sheep', $sheep->tag, "Registrasi Domba Baru: {$sheep->tag}");
            
            DB::commit();
            
            return redirect()->back()->with('success', "Domba {$sheep->tag} berhasil ditambahkan.");
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($imgUrl && $request->hasFile('imgFile')) {
                $this->safeDeleteImage($imgUrl);
            }
            throw $e;
        }
    }

    public function update(SheepUpdateRequest $request, $id): RedirectResponse
    {
        $sheep = Sheep::findOrFail($id);

        $validated = $request->validated();
        $data = collect($validated)
            ->only(['tag', 'type', 'gender', 'weight', 'status', 'block', 'health', 'birth_date', 'price_per_kg', 'parent_male', 'parent_female'])
            ->toArray();

        if (isset($validated['age'])) {
            $data['age_string'] = $validated['age'];
        }

        $newUrl = null;
        if ($request->hasFile('imgFile')) {
            $newUrl = $this->safeUploadImage($request->file('imgFile'), 'sheep', $sheep->tag);
            if ($newUrl) {
                $data['img_url'] = $newUrl;
            }
        } elseif ($request->has('img')) {
            $data['img_url'] = $request->input('img');
        }

        try {
            DB::beginTransaction();
            
            $oldUrl = $sheep->img_url;
            $sheep->update($data);
            
            if ($newUrl && $oldUrl && $newUrl !== $oldUrl) {
                $this->safeDeleteImage($oldUrl);
            }
            
            $this->logActivity('update', 'sheep', $sheep->tag, "Update Data Domba: {$sheep->tag}");
            
            DB::commit();
            return redirect()->back()->with('success', "Domba {$sheep->tag} berhasil diperbarui.");
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($newUrl) {
                $this->safeDeleteImage($newUrl);
            }
            throw $e;
        }
    }

    public function destroy($id): RedirectResponse
    {
        $sheep = Sheep::findOrFail($id);
        $this->authorize('delete', $sheep);

        $tag = $sheep->tag;
        $this->safeDeleteImage($sheep->img_url);

        $sheep->delete();
        $this->logActivity('delete', 'sheep', $tag, "Hapus Domba: {$tag}");

        return redirect()->back()->with('success', "Domba {$tag} dihapus.");
    }
}
