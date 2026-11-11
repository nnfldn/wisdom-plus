<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'can' => $this->resolveCanFlags($user),
            ],
            'public' => [
                'salesWhatsapp' => config('services.sales.whatsapp'),
                'chatbotProxy' => '/api/chat/ask',
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Build a single flat permission map yang mudah dipakai frontend.
     * Format: auth.can.<resource>.<ability> → bool
     *
     * @return array<string, array<string, bool>>
     */
    protected function resolveCanFlags(?\App\Models\User $user): array
    {
        if (! $user) {
            return [];
        }

        $resources = [
            'sheep' => \App\Models\Sheep::class,
            'breeding' => \App\Models\BreedingRecord::class,
            'medical' => \App\Models\MedicalRecord::class,
            'posts' => \App\Models\Post::class,
            'testimonials' => \App\Models\Testimonial::class,
            'heroes' => \App\Models\Hero::class,
            'stats' => \App\Models\Stat::class,
            'features' => \App\Models\Feature::class,
            'about' => \App\Models\AboutSection::class,
            'users' => \App\Models\User::class,
            'activity_logs' => \App\Models\ActivityLog::class,
        ];

        $can = [];
        foreach ($resources as $key => $class) {
            // Untuk ability yang membutuhkan instance model (view/update/delete),
            // kita hanya cek berdasar class via Gate. Jika policy method menerima
            // instance, fallback ke false agar tidak melempar ArgumentCountError.
            $can[$key] = [
                'view' => $this->canSafely($user, 'viewAny', $class),
                'create' => $this->canSafely($user, 'create', $class),
                'update' => $this->canSafely($user, 'updateAny', $class),
                'delete' => $this->canSafely($user, 'deleteAny', $class),
            ];
        }

        return $can;
    }

    /**
     * Cek ability terhadap class. Untuk ability yang policy-nya butuh instance
     * (view/update/delete), kita lewatkan dengan menerjemahkan ke
     * "viewAny/updateAny/deleteAny" — kalau tidak ada, jatuh ke role-based heuristic
     * via BasePolicy::before. Hasilnya tetap aman karena route + policy
     * tetap melakukan otorisasi final di setiap request mutasi.
     */
    protected function canSafely(\App\Models\User $user, string $ability, string $class): bool
    {
        try {
            // Beberapa ability tidak punya method, tapi BasePolicy::before bisa lolos
            // untuk super-admin. Untuk admin biasa, default false.
            if (in_array($ability, ['updateAny', 'deleteAny'], true)) {
                if ($user->role === 'super-admin') {
                    return true;
                }

                return false;
            }

            return $user->can($ability, $class);
        } catch (\Throwable $e) {
            return false;
        }
    }
}
