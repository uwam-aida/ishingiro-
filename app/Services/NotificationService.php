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
        // 1. Save to database for ALL users with matching role
        $users = $this->getUsersByRole($roleName);
        
        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,  // ← IMPORTANT: Link to specific user
                'role'    => $roleName,
                'message' => $message,
            ]);
        }

        // 2. Get player IDs for push notifications
        $playerIds = $this->getPlayerIdsByRole($roleName);

        if (!empty($playerIds)) {
            $this->sendViaOneSignal($playerIds, $message);
        }
    }

    /**
     * Get users by role name
     */
    private function getUsersByRole(string $roleName): \Illuminate\Support\Collection
    {
        if ($roleName === 'all' || $roleName === 'everyone') {
            return User::all();
        }
        
        return User::whereHas('role', fn($q) => $q->where('name', $roleName))->get();
    }

    /**
     * Get player IDs by role name
     */
    private function getPlayerIdsByRole(string $roleName): array
    {
        if ($roleName === 'all' || $roleName === 'everyone') {
            return User::whereNotNull('player_id')
                ->pluck('player_id')
                ->toArray();
        }

        return User::whereHas('role', fn($q) => $q->where('name', $roleName))
            ->whereNotNull('player_id')
            ->pluck('player_id')
            ->toArray();
    }

    /**
     * Send via OneSignal push service
     */
    private function sendViaOneSignal(array $playerIds, string $message): void
    {
        if (empty($this->appId) || empty($this->apiKey)) {
            Log::warning('OneSignal credentials not configured');
            return;
        }

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