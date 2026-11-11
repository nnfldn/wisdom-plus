<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    protected $fillable = [
        'sheep_id', 'diagnosis', 'treatment', 'notes', 'handled_at'
    ];

    protected $casts = [
        'handled_at' => 'date',
    ];

    public function sheep(): BelongsTo
    {
        return $this->belongsTo(Sheep::class);
    }
}
