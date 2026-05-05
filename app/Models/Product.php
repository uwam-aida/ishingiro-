<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'cost',
        'category',
        'type',      // NEW (baked / unbaked)
        'stock'
    ];
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    public function damages()
    {
        return $this->hasMany(Damage::class);
    }

    public function productions()
    {
        return $this->hasMany(Production::class);
    }
     public function targets()
    {
        return $this->hasMany(SalesTarget::class);
    }
}
