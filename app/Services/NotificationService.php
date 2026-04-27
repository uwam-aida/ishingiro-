<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    protected $appId;
    protected $apiKey;

    public function __construct()
    {
        $this->appId = config('services.onesignal.app_id');
        $this->apiKey = config('services.onesignal.api_key');
    }

    public function sendToRole($roleName, $message)
    {
        $players = User::whereHas('role', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        })->whereNotNull('player_id')->pluck('player_id')->toArray();

        if (empty($players)) {
            return;
        }

        return Http::withHeaders([
            'Authorization' => 'Basic ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://onesignal.com/api/v1/notifications', [
            'app_id' => $this->appId,
            'include_player_ids' => $players,
            'contents' => [
                'en' => $message,
            ],
        ])->json();
    }
}
