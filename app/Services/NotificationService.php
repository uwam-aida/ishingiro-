<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected $appId;
    protected $apiKey;

    public function __construct()
    {
        $this->appId  = config('services.onesignal.app_id');
        $this->apiKey = config('services.onesignal.api_key');
    }

    /**
     * Send notification to a specific role or all users
     * 
     * @param string $roleName - Role name or "all" for all users
     * @param string $message - Message to send
     */
    public function sendToRole(string $roleName, string $message): void
    {
        // 1. Save to our own DB so the app can fetch it later
        Notification::create([
            'role'    => $roleName,
            'message' => $message,
        ]);

        // 2. Get player IDs based on role
        $playerIds = $this->getPlayerIdsByRole($roleName);

        if (empty($playerIds)) {
            return;
        }

        // 3. Push to OneSignal for real-time device notification
        $this->sendViaOneSignal($playerIds, $message);
    }

    /**
     * Get player IDs by role name
     * 
     * @param string $roleName - Role name or "all"
     * @return array Player IDs
     */
    private function getPlayerIdsByRole(string $roleName): array
    {
        // Handle "all" role - get all users with player_id
        if ($roleName === 'all' || $roleName === 'everyone') {
            return User::whereNotNull('player_id')
                ->pluck('player_id')
                ->toArray();
        }

        // Handle specific role
        return User::whereHas('role', fn($q) => $q->where('name', $roleName))
            ->whereNotNull('player_id')
            ->pluck('player_id')
            ->toArray();
    }

    /**
     * Send via OneSignal push service
     * 
     * @param array $playerIds - Player IDs to send to
     * @param string $message - Message content
     */
    private function sendViaOneSignal(array $playerIds, string $message): void
    {
        try {
            Http::withHeaders([
                'Authorization' => 'Basic ' . $this->apiKey,
                'Content-Type'  => 'application/json',
            ])->post('https://onesignal.com/api/v1/notifications', [
                'app_id'             => $this->appId,
                'include_player_ids' => $playerIds,
                'contents'           => ['en' => $message],
            ]);
        } catch (\Exception $e) {
            Log::error('OneSignal notification failed: ' . $e->getMessage());
        }
    }
}
