<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_number',
        'user_id',
        'recipient_name',
        'location',
        'items',
        'total_amount',
    ];

    protected $casts = [
        'items' => 'array',
        'total_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Auto-generate note number before creating
    protected static function booted()
    {
        static::creating(function ($note) {
            $note->note_number = 'DN-' . strtoupper(uniqid());
        });
    }
}