<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    protected $fillable = [
        'sale_id', 'delivery_date', 'driver_name', 
        'vehicle_plate', 'delivery_status', 'proof_image_url'
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
