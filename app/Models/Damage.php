<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Damage extends Model
{
    use HasFactory;
    protected $fillable = [
    'product_id',
    'quantity',
    'reason',
    'location'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
