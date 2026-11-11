<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title', 'content', 'image_url', 'category', 'is_published'
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];
}
