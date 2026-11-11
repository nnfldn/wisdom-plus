<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Pastikan user terotentikasi memiliki salah satu role yang diizinkan.
     * Pemakaian: Route::middleware('role:super-admin') / role:admin,super-admin
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (empty($roles)) {
            return $next($request);
        }

        if (! in_array($user->role, $roles, true)) {
            abort(403, 'Akses ditolak: role Anda tidak diizinkan untuk halaman ini.');
        }

        return $next($request);
    }
}
