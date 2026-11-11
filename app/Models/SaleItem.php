<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = ['sale_id', 'sheep_id', 'price'];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function sheep()
    {
        return $this->belongsTo(Sheep::class);
    }
}
