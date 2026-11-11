<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLog extends Model
{
    protected $fillable = [
        'session_id',
        'ip_address',
        'user_agent',
        'question',
        'answer',
        'status',
        'upstream_status',
        'latency_ms',
    ];
}
