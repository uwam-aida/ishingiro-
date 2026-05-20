<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CakeOrder extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'customer_name',
        'phone',
        'cake_type',
        'quantity',
        'price',
        'advance_payment',
        'remaining_payment',
        'total_paid',
        'location',
        'delivery_date',
        'status',
        'cake_message',
        'cake_size',
        'frosting_cream',
        'frosting_color',
        'special_instructions',
        'reception_location',
        'needs_sample',
        'inspo_image',
        'inspo_image_path',
        'payment_method',
        'payer_name',
    ];

    protected $casts = [
        'needs_sample' => 'boolean',
        'delivery_date' => 'date',
        'advance_payment' => 'decimal:2',
        'remaining_payment' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    protected $appends = ['inspo_image_url'];

    /**
     * Automatically calculate remaining payment when saving
     */
    protected static function booted()
    {
        static::saving(function ($cakeOrder) {
            // Calculate remaining payment based on price and total_paid
            $cakeOrder->remaining_payment = max(0, $cakeOrder->price - $cakeOrder->total_paid);
        });

        static::creating(function ($cakeOrder) {
            // On creation, total_paid equals advance_payment
            if ($cakeOrder->advance_payment > 0 && $cakeOrder->total_paid == 0) {
                $cakeOrder->total_paid = $cakeOrder->advance_payment;
                $cakeOrder->remaining_payment = $cakeOrder->price - $cakeOrder->advance_payment;
            }
        });
    }

    /**
     * Accessor for full image URL
     * Generates the public URL for the inspiration image
     */
    public function getInspoImageUrlAttribute()
    {
        if ($this->inspo_image_path) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('public');
            return $disk->url($this->inspo_image_path);
        }
        if ($this->inspo_image) {
            return $this->inspo_image; // Legacy support for old URL field
        }
        return null;
    }

    /**
     * Check if order is fully paid
     */
    public function isFullyPaid(): bool
    {
        return $this->total_paid >= $this->price;
    }

    /**
     * Get payment status text
     */
    public function getPaymentStatusAttribute(): string
    {
        if ($this->total_paid == 0) {
            return 'unpaid';
        }
        if ($this->total_paid >= $this->price) {
            return 'paid';
        }
        return 'partial';
    }

    /**
     * Relationships
     */
    public function revenues()
    {
        return $this->morphMany(Revenue::class, 'reference');
    }
}