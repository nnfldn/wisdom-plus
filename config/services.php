<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'supabase' => [
        'storage_url' => env('SUPABASE_STORAGE_URL'),
        'url' => env('SUPABASE_URL'),
    ],

    'sales' => [
        'whatsapp' => env('SALES_WHATSAPP', '6281234567890'),
    ],

    'chatbot' => [
        'url' => env('CHATBOT_API_URL', 'https://chatbot-wisma-domba-farm.vercel.app/api/ask'),
        'key' => env('CHATBOT_API_KEY'),
        'timeout' => (int) env('CHATBOT_TIMEOUT', 30),
        'log_transcripts' => filter_var(env('CHATBOT_LOG_TRANSCRIPTS', true), FILTER_VALIDATE_BOOLEAN),
    ],

];
