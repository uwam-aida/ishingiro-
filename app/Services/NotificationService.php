<?php

namespace App\Services;

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

    public function send(array $playerIds, string $message)
    {
        if (empty($playerIds)) {
            return false;
        }

        return Http::withHeaders([
            'Authorization' => 'Basic ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://onesignal.com/api/v1/notifications', [
            'app_id' => $this->appId,
            'include_player_ids' => $playerIds,
            'contents' => [
                'en' => $message,
            ],
        ])->json();
    }
}