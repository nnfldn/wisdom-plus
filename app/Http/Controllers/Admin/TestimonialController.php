<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialRequest;
use App\Models\Sheep;
use App\Models\Testimonial;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    use LogsActivity;

    public function index(): Response
    {
        return Inertia::render('Admin/Testimonials', [
            'testimonials' => Testimonial::orderBy('order', 'asc')->get(),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(TestimonialRequest $request): RedirectResponse
    {
        $testimonial = Testimonial::create($request->validated());
        $this->logActivity('create', 'testimonial', $testimonial->id, "Menambah testimoni baru: {$testimonial->name}");

        return redirect()->back()->with('success', 'Testimoni ditambahkan.');
    }

    public function update(TestimonialRequest $request, $id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update($request->validated());
        $this->logActivity('update', 'testimonial', $testimonial->id, "Memperbarui testimoni: {$testimonial->name}");

        return redirect()->back()->with('success', 'Testimoni diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $this->authorize('delete', $testimonial);

        $name = $testimonial->name;
        $testimonial->delete();
        $this->logActivity('delete', 'testimonial', $id, "Menghapus testimoni: {$name}");

        return redirect()->back()->with('success', 'Testimoni dihapus.');
    }
}
