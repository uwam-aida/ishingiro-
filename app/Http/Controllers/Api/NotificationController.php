<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications
    // Returns all notifications for the authenticated user's role
    public function index(Request $request)
    {
        $role = auth()->user()->role->name;

        return Notification::where('role', $role)
            ->latest()
            ->get();
    }

    // GET /api/notifications/unread-count
    // Returns the count of unread notifications (for the badge)
    public function unreadCount()
    {
        $role = auth()->user()->role->name;

        return response()->json([
            'count' => Notification::where('role', $role)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    // PUT /api/notifications/{id}/read
    // Mark a single notification as read
    public function markRead($id)
    {
        $role = auth()->user()->role->name;

        $notification = Notification::where('id', $id)
            ->where('role', $role)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return $notification;
    }

    // PUT /api/notifications/read-all
    // Mark all notifications for this role as read
    public function markAllRead()
    {
        $role = auth()->user()->role->name;

        Notification::where('role', $role)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'all marked as read']);
    }
}