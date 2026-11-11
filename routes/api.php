<?php

use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\SheepApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public Data for smartsheep-public
Route::middleware('throttle:public-api')->group(function () {
    Route::get('/sheep', [SheepApiController::class, 'index']);
    Route::get('/sheep/{tag}', [SheepApiController::class, 'show']);
    Route::get('/sheep-tags', [SheepApiController::class, 'all']);
});

// Chatbot proxy — keeps upstream key on the server side and rate-limits per session+IP.
Route::middleware('throttle:chat')->post('/chat/ask', [ChatbotController::class, 'ask']);

// Cloud Run Scheduler Endpoint
Route::post('/trigger-scheduler', function (Request $request) {
    if ($request->bearerToken() !== env('GCP_SCHEDULER_TOKEN')) {
        abort(403, 'Unauthorized');
    }
    \Illuminate\Support\Facades\Artisan::call('schedule:run');
    return response()->json(['message' => 'Scheduler executed', 'output' => \Illuminate\Support\Facades\Artisan::output()]);
});
