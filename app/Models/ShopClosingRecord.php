<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopClosingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_manager_id',
        'location',
        'closing_date',
        'products',
        'summary',
    ];

    protected $casts = [
        'closing_date' => 'date',
        'products' => 'array',
        'summary' => 'array',
    ];

    public function shopManager()
    {
        return $this->belongsTo(User::class, 'shop_manager_id');
    }
}