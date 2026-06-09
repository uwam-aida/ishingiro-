<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SentMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'recipient_role',
        'message',
        'recipient_count',
    ];

    protected $casts = [
        'recipient_count' => 'integer',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}