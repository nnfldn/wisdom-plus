<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\InteractsWithSupabaseImages;
use App\Http\Controllers\Controller;
use App\Http\Requests\PostStoreRequest;
use App\Http\Requests\PostUpdateRequest;
use App\Models\Post;
use App\Models\Sheep;
use App\Services\SupabaseStorageService;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    use InteractsWithSupabaseImages, LogsActivity;

    private const ALLOWED_TAGS = '<br><b><i><strong><em><span><ul><li><ol><p><a><h1><h2><h3><h4><h5><h6><blockquote><pre><code><hr><br/><hr/>';

    public function __construct(SupabaseStorageService $storageService)
    {
        $this->bootSupabaseStorage($storageService);
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Posts', [
            'posts' => Post::orderBy('created_at', 'desc')->paginate(10),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
        ]);
    }

    public function store(PostStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['content'] = strip_tags($data['content'] ?? '', self::ALLOWED_TAGS);

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'posts', 'post');
            if ($url) {
                $data['image_url'] = $url;
            }
        }

        $post = Post::create($data);
        $this->logActivity('create', 'post', $post->id, "Membuat postingan baru: {$post->title}");

        return redirect()->back()->with('success', 'Postingan dibuat.');
    }

    public function update(PostUpdateRequest $request, $id): RedirectResponse
    {
        $post = Post::findOrFail($id);
        $data = $request->validated();
        $data['content'] = strip_tags($data['content'] ?? '', self::ALLOWED_TAGS);

        if ($request->hasFile('imageFile')) {
            $url = $this->safeUploadImage($request->file('imageFile'), 'posts', 'post');
            if ($url) {
                $this->safeDeleteImage($post->image_url);
                $data['image_url'] = $url;
            }
        }

        $post->update($data);
        $this->logActivity('update', 'post', $post->id, "Memperbarui postingan: {$post->title}");

        return redirect()->back()->with('success', 'Postingan diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $post = Post::findOrFail($id);
        $this->authorize('delete', $post);

        $title = $post->title;
        $this->safeDeleteImage($post->image_url);

        $post->delete();
        $this->logActivity('delete', 'post', $id, "Menghapus postingan: {$title}");

        return redirect()->back()->with('success', 'Postingan dihapus.');
    }
}
