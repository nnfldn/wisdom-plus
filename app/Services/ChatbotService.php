<?php

namespace App\Services;

use App\Models\ChatLog;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
    /**
     * Ask the chatbot proxy a question.
     */
    public function ask(string $question, ?string $sessionId = null, ?string $ip = null, ?string $userAgent = null): array
    {
        $url = config('services.chatbot.url');
        $key = config('services.chatbot.key');
        $timeout = (int) config('services.chatbot.timeout', 30);

        // Security: Limit question length and redact PII
        $trimmedQuestion = mb_substr(trim($question), 0, 1000);
        $sanitized = $this->redactPii($trimmedQuestion);
        
        $sessionId = $sessionId ?: 'anon-' . bin2hex(random_bytes(8));
        $startedAt = microtime(true);
        $status = 'success';
        $upstreamStatus = null;
        $answer = null;

        try {
            $request = Http::timeout($timeout)
                ->acceptJson()
                ->asJson();

            if (! empty($key)) {
                $request = $request->withHeaders(['X-Chatbot-Key' => $key]);
            }

            $response = $request->post($url, [
                'question' => $sanitized,
                'session_id' => $sessionId,
            ]);

            $upstreamStatus = $response->status();

            if ($response->successful()) {
                $answer = (string) ($response->json('answer') ?? 'Maaf, saya tidak menerima jawaban.');
            } else {
                $status = 'upstream_error';
                $answer = 'Maaf, asisten AI sedang sibuk. Silakan coba lagi sebentar lagi.';
            }
        } catch (ConnectionException|RequestException $e) {
            $status = 'connection_error';
            $answer = 'Koneksi ke asisten AI terputus. Silakan coba lagi nanti.';
            Log::error('Chatbot connection error', ['message' => $e->getMessage()]);
        } catch (\Throwable $e) {
            $status = 'error';
            $answer = 'Terjadi kesalahan sistem pada asisten AI.';
            Log::error('Chatbot system error', ['message' => $e->getMessage()]);
        }

        // Always log the transcript
        if (config('services.chatbot.log_transcripts', true)) {
            ChatLog::create([
                'session_id' => $sessionId,
                'question' => $trimmedQuestion, // Original (for admin review)
                'answer' => $answer,
                'status' => $status,
                'upstream_status' => $upstreamStatus,
                'duration_ms' => (int) ((microtime(true) - $startedAt) * 1000),
                'ip_address' => $ip,
                'user_agent' => $userAgent,
            ]);
        }

        return [
            'answer' => $answer,
            'status' => $status,
        ];
    }

    /**
     * Redact Personally Identifiable Information (PII) before sending to upstream LLM.
     */
    protected function redactPii(string $text): string
    {
        // Email
        $text = preg_replace('/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/', '[email]', $text) ?? $text;

        // Phone numbers (Indonesian & common international formats)
        // Matches: +62812..., 0812..., 62812..., 021-..., etc. with optional spaces/hyphens
        $text = preg_replace('/(\+?62|08|021)[\s\-\.]?\d{2,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,5}/', '[phone]', $text) ?? $text;

        // Generic long digit strings (Potential NIK, Account Number, etc - 10+ digits)
        $text = preg_replace('/\b\d{10,20}\b/', '[id_number]', $text) ?? $text;

        return $text;
    }
}
