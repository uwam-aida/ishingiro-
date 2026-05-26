<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userRole = auth()->user()->role->name ?? null;

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Forbidden - You do not have permission to access this resource',
                'required_roles' => $roles,
                'your_role' => $userRole
            ], 403);
        }

        return $next($request);
    }
}