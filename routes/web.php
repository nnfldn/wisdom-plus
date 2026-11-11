<?php

use App\Http\Controllers\Admin\AboutSectionController;
use App\Http\Controllers\Admin\BreedingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DistributionController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\FeedingController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\HistoryController;
use App\Http\Controllers\Admin\MedicalController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\SheepController;
use App\Http\Controllers\Admin\StatController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// ──────────────────────────────────────────────────────────────────
// Public Routes
// ──────────────────────────────────────────────────────────────────
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/news/{id}', [PublicController::class, 'news'])->name('news.show');
Route::get('/about', [PublicController::class, 'about'])->name('about');
Route::get('/catalog', [PublicController::class, 'catalog'])->name('catalog');
Route::get('/ktp/{tag}', [PublicController::class, 'ktp'])->name('ktp');
Route::get('/scanner', [PublicController::class, 'scanner'])->name('scanner');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');

// ──────────────────────────────────────────────────────────────────
// Admin Routes (Immersive PWA Experience)
// ──────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    
    // Core Launcher (App Drawer)
    Route::get('/menu', [DashboardController::class, 'menu'])->name('menu');
    
    // Default Route is the App Drawer
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Stats Overview (formerly main dashboard)
    Route::get('/overview', [DashboardController::class, 'overview'])->name('overview');

    // Operations
    Route::get('/sheep', [SheepController::class, 'index'])->name('sheep');
    Route::post('/sheep', [SheepController::class, 'store'])->name('sheep.store');
    Route::patch('/sheep/{id}', [SheepController::class, 'update'])->name('sheep.update');
    Route::delete('/sheep/{id}', [SheepController::class, 'destroy'])
        ->middleware('role:super-admin')
        ->name('sheep.destroy');

    Route::get('/breeding', [BreedingController::class, 'index'])->name('breeding');
    Route::post('/breeding', [BreedingController::class, 'store'])->name('breeding.store');
    Route::put('/breeding/{id}', [BreedingController::class, 'update'])->name('breeding.update');
    Route::delete('/breeding/{id}', [BreedingController::class, 'destroy'])
        ->middleware('role:super-admin')
        ->name('breeding.destroy');

    Route::get('/medical', [MedicalController::class, 'index'])->name('medical');
    Route::post('/medical', [MedicalController::class, 'store'])->name('medical.store');
Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/{id}', [SaleController::class, 'show'])->name('sales.show');
    Route::patch('/sales/{id}/payment', [SaleController::class, 'updatePayment'])->name('sales.update-payment');
    Route::delete('/sales/{id}', [SaleController::class, 'destroy'])->name('sales.destroy');

    Route::get('/distributions', [DistributionController::class, 'index'])->name('distributions.index');
    Route::patch('/distributions/{id}', [DistributionController::class, 'update'])->name('distributions.update');

    Route::get('/feeding', [FeedingController::class, 'index'])->name('feeding');
    Route::get('/history', [HistoryController::class, 'index'])->name('history');

    // CMS & Content
    Route::get('/posts', [PostController::class, 'index'])->name('posts');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/{id}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])
        ->middleware('role:super-admin')
        ->name('posts.destroy');

    Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials');
    Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');
    Route::patch('/testimonials/{id}', [TestimonialController::class, 'update'])->name('testimonials.update');
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy'])
        ->middleware('role:super-admin')
        ->name('testimonials.destroy');

    Route::get('/heroes', [HeroController::class, 'index'])->name('heroes');
    Route::middleware('role:super-admin')->group(function () {
        Route::post('/heroes', [HeroController::class, 'store'])->name('heroes.store');
        Route::post('/heroes/{id}', [HeroController::class, 'update'])->name('heroes.update');
        Route::delete('/heroes/{id}', [HeroController::class, 'destroy'])->name('heroes.destroy');
    });

    Route::get('/stats', [StatController::class, 'index'])->name('stats');
    Route::middleware('role:super-admin')->group(function () {
        Route::post('/stats', [StatController::class, 'store'])->name('stats.store');
        Route::patch('/stats/{id}', [StatController::class, 'update'])->name('stats.update');
        Route::delete('/stats/{id}', [StatController::class, 'destroy'])->name('stats.destroy');
    });

    Route::get('/features', [FeatureController::class, 'index'])->name('features');
    Route::middleware('role:super-admin')->group(function () {
        Route::post('/features', [FeatureController::class, 'store'])->name('features.store');
        Route::post('/features/{id}', [FeatureController::class, 'update'])->name('features.update');
        Route::delete('/features/{id}', [FeatureController::class, 'destroy'])->name('features.destroy');
    });

    Route::get('/about', [AboutSectionController::class, 'index'])->name('about');
    Route::middleware('role:super-admin')->group(function () {
        Route::post('/about/{id}', [AboutSectionController::class, 'update'])->name('about.update');
    });

    // Users
    Route::middleware('role:super-admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

// ──────────────────────────────────────────────────────────────────
// Profile (auth)
// ──────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
