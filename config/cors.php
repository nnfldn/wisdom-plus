<?php

// Hanya izinkan tunnel Cloudflare di environment non-production (untuk dev/staging).
$tunnelPatterns = env('APP_ENV') === 'production'
    ? []
    : ['/https?:\/\/.*\.trycloudflare\.com/'];

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter([
        env('APP_URL', 'http://localhost'),
        env('FRONTEND_URL'),
    ]),
    'allowed_origins_patterns' => $tunnelPatterns,
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
