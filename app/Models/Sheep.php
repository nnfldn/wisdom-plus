<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sheep extends Model
{
    protected $fillable = [
        'tag', 'type', 'gender', 'weight', 'status', 'price_per_kg', 
        'age_string', 'block', 'health', 'parent_male', 'parent_female', 
        'birth_date', 'img_url', 'qr_url', 'sold_at'
    ];

    protected $appends = ['age_display'];

    public function getAgeDisplayAttribute()
    {
        if (!$this->birth_date) return $this->age_string;
        
        $birth = \Carbon\Carbon::parse($this->birth_date);
        $now = \Carbon\Carbon::now();
        
        $diff = $birth->diff($now);
        
        if ($diff->y > 0) return $diff->y . ' thn ' . $diff->m . ' bln';
        if ($diff->m > 0) return $diff->m . ' bln ' . $diff->d . ' hari';
        return $diff->d . ' hari';
    }

    public function matings(): HasMany
    {
        return $this->hasMany(BreedingRecord::class, 'female_id');
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function saleItem()
    {
        return $this->hasOne(SaleItem::class);
    }
}
