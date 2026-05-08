<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    protected $appId;
    protected $apiKey;

    public function __construct()
    {
        $this->appId  = config('services.onesignal.app_id');
        $this->apiKey = config('services.onesignal.api_key');
    }

    public function sendToRole(string $roleName, string $message): void
    {
        // 1. Save to our own DB so the app can fetch it later
        Notification::create([
            'role'    => $roleName,
            'message' => $message,
        ]);

        // 2. Push to OneSignal for real-time device notification
        $playerIds = User::whereHas('role', fn($q) => $q->where('name', $roleName))
            ->whereNotNull('player_id')
            ->pluck('player_id')
            ->toArray();

        if (empty($playerIds)) {
            return;
        }

        Http::withHeaders([
            'Authorization' => 'Basic ' . $this->apiKey,
            'Content-Type'  => 'application/json',
        ])->post('https://onesignal.com/api/v1/notifications', [
            'app_id'             => $this->appId,
            'include_player_ids' => $playerIds,
            'contents'           => ['en' => $message],
        ]);
    }
}