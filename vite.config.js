import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                // Cache hanya asset publik yang dihasilkan Vite. Hindari
                // meng-cache asset admin yang sensitif/dinamis (Inertia akan
                // fetch ulang JSON props per request).
                globPatterns: [
                    'assets/**/*.{js,css,svg,png,webp,woff2}',
                    'manifest.webmanifest',
                ],
                navigateFallback: '/admin/menu',
                navigateFallbackDenylist: [
                    /^\/login/,
                    /^\/register/,
                    /^\/api\//,
                    /^\/storage\//,
                    /^\/healthz$/,
                ],
                runtimeCaching: [
                    {
                        // Foto domba dari Supabase Storage / fallback Unsplash
                        urlPattern: /^https:\/\/(.*\.supabase\.co|images\.unsplash\.com)\//,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'wd-public-images',
                            expiration: {
                                maxEntries: 200,
                                maxAgeSeconds: 60 * 60 * 24 * 7,
                            },
                        },
                    },
                ],
            },
            manifest: {
                name: 'WisDom+ Admin',
                short_name: 'WisDom+',
                description: 'Sistem Manajemen Peternakan Domba WisDom+',
                theme_color: '#2B5E41', // Brand Primary
                background_color: '#f8fafc', // slate-50
                display: 'standalone',
                scope: '/admin',
                start_url: '/admin/menu',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        }),
    ],
});
