<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChatAskRequest;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;

class ChatbotController extends Controller
{
    public function __construct(protected ChatbotService $chatbot)
    {
    }

    public function ask(ChatAskRequest $request): JsonResponse
    {
        $result = $this->chatbot->ask(
            question: (string) $request->input('question'),
            sessionId: $request->input('session_id'),
            ip: $request->ip(),
            userAgent: (string) $request->userAgent(),
        );

        return response()->json([
            'answer' => $result['answer'],
            'status' => $result['status'],
        ]);
    }
}
