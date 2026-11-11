<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BreedingRecord extends Model
{
    protected $fillable = [
        'male_id', 'female_id', 'mating_date', 'status', 'est_birth_date', 'notes'
    ];

    public function male(): BelongsTo
    {
        return $this->belongsTo(Sheep::class, 'male_id');
    }

    public function female(): BelongsTo
    {
        return $this->belongsTo(Sheep::class, 'female_id');
    }
}
