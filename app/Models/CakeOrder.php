<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CakeOrder extends Model
{
    use HasFactory;
    protected $fillable = [
    'customer_name',
    'phone',
    'cake_type',
    'quantity',
    'price',
    'location',
    'delivery_date',
    'status'
    ];
}
