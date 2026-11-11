<?php

namespace App\Http\Controllers;

use App\Models\Sheep;
use App\Models\Post;
use App\Models\Testimonial;
use App\Models\Hero;
use App\Models\Stat;
use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        return Inertia::render('Public/Home', [
            'posts' => Post::where('is_published', true)->orderBy('created_at', 'desc')->take(6)->get(),
            'testimonials' => Testimonial::where('is_active', true)->orderBy('created_at', 'desc')->get(),
            'heroes' => Hero::where('is_active', true)->orderBy('order', 'asc')->get(),
            'trust_stats' => Stat::where('is_active', true)->orderBy('order', 'asc')->get(),
            'core_features' => Feature::where('is_active', true)->orderBy('order', 'asc')->get(),
        ]);
    }

    public function news($id)
    {
        $post = Post::findOrFail($id);
        return Inertia::render('Public/NewsDetail', [
            'post' => $post
        ]);
    }

    public function about()
    {
        return Inertia::render('Public/About', [
            'aboutSections' => \App\Models\AboutSection::where('is_active', true)->orderBy('order', 'asc')->get()
        ]);
    }

    public function catalog()
    {
        $sheepData = Sheep::get()->map(function($s) {
            return [
                'id' => $s->id,
                'tag' => $s->tag,
                'type' => $s->type,
                'weight' => (float)$s->weight,
                'status' => $s->status,
                'pricePerKg' => $s->price_per_kg,
                'age' => $s->age_display,
                'block' => $s->block,
                'health' => $s->health,
                'birthDate' => $s->birth_date,
                'img' => $s->img_url,
            ];
        });

        return Inertia::render('Public/Catalog', [
            'sheepData' => $sheepData
        ]);
    }

    public function ktp($tag)
    {
        $s = Sheep::where('tag', $tag)->first();

        if (!$s) {
            return redirect()->route('catalog');
        }

        $sheep = [
            'id' => $s->id,
            'tag' => $s->tag,
            'type' => $s->type,
            'gender' => $s->gender,
            'weight' => (float)$s->weight,
            'status' => $s->status,
            'pricePerKg' => $s->price_per_kg,
            'age' => $s->age_display,
            'block' => $s->block,
            'health' => $s->health,
            'parentMale' => $s->parent_male,
            'parentFemale' => $s->parent_female,
            'birthDate' => $s->birth_date,
            'img' => $s->img_url ?: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80",
        ];

        return Inertia::render('Public/KTP', [
            'sheep' => $sheep,
            'salesWhatsapp' => config('services.sales.whatsapp')
        ]);
    }

    public function scanner()
    {
        $sheepTags = Sheep::pluck('tag');

        return Inertia::render('Public/Scanner', [
            'sheepData' => $sheepTags->map(fn($tag) => ['tag' => $tag])
        ]);
    }

    public function contact()
    {
        return Inertia::render('Public/Contact');
    }
}
