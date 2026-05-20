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





<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DeliveryNoteService
{
    /**
     * Generate a PDF delivery note and return the raw PDF bytes.
     *
     * @param  Collection  $orders      — Order models with items.product eager-loaded
     * @param  Collection  $cakeOrders  — CakeOrder models
     * @param  string      $recipient   — Printed as "CUSTOM NAME" on the note
     * @param  Carbon      $deliveredAt — Date/time printed on the note
     * @return string  Raw PDF content
     */
    public function generate(
        Collection $orders,
        Collection $cakeOrders,
        string $recipient,
        Carbon $deliveredAt,
    ): string {
        // Flatten everything into a single line-item list
        $items = collect();

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $items->push([
                    'name'       => optional($item->product)->name ?? 'Unknown',
                    'qty'        => $item->quantity,
                    'unit_price' => $item->price,
                    'total'      => $item->quantity * $item->price,
                ]);
            }
        }

        foreach ($cakeOrders as $cake) {
            $items->push([
                'name'       => $cake->cake_type . ' — ' . $cake->customer_name,
                'qty'        => $cake->quantity,
                'unit_price' => $cake->price,
                'total'      => $cake->quantity * $cake->price,
            ]);
        }

        $pdf = Pdf::loadView('pdf.delivery-note', [
            'recipient'   => strtoupper($recipient),
            'date'        => $deliveredAt->format('n/j/Y'),
            'time'        => $deliveredAt->format('g:i A'),
            'items'       => $items,
            'grand_total' => $items->sum('total'),
        ])->setPaper('a5', 'portrait');

        return $pdf->output();
    }
}