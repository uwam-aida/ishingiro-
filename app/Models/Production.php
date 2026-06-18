<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Production extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_id',
        'quantity',
        'location'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship to the user who created the production record
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}