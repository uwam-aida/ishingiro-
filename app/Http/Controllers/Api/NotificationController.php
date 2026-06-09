<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications
    public function index(Request $request)
    {
        $userId = auth()->id();
        
        return Notification::where('user_id', $userId)
            ->orWhereNull('user_id')  // For backward compatibility
            ->latest()
            ->get();
    }

    // GET /api/notifications/unread-count
    public function unreadCount()
    {
        $userId = auth()->id();
        
        return response()->json([
            'count' => Notification::where('user_id', $userId)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    // PUT /api/notifications/{id}/read
    public function markRead($id)
    {
        $userId = auth()->id();
        
        $notification = Notification::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return $notification;
    }

    // PUT /api/notifications/read-all
    public function markAllRead()
    {
        $userId = auth()->id();
        
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'all marked as read']);
    }
}