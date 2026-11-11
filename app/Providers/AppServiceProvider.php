<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register custom PgBouncer-compatible PostgreSQL connection
        // to handle boolean type conversion with emulated prepared statements.
        \Illuminate\Database\Connection::resolverFor('pgsql', function ($pdo, $database, $prefix, $config) {
            return new \App\Database\PgBouncerConnection($pdo, $database, $prefix, $config);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        $this->configureRateLimiting();
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('public-api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Too many requests, please try again later.'
                ], 429, $headers);
            });
        });

        RateLimiter::for('chat', function (Request $request) {
            $sessionId = (string) $request->input('session_id', '');
            $key = $request->ip().'|'.substr(hash('sha256', $sessionId), 0, 16);

            return Limit::perMinute(20)->by($key)->response(function (Request $request, array $headers) {
                return response()->json([
                    'status' => 'error',
                    'answer' => 'Anda mengirim pertanyaan terlalu cepat. Mohon tunggu sebentar lalu coba lagi.',
                ], 429, $headers);
            });
        });
    }
}
