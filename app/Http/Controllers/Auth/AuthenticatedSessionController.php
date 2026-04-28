<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // return redirect()->intended(RouteServiceProvider::HOME);
        $user = auth()->user();

        return match ($user->role->name) {
            'marketing_manager' => redirect('/marketing/dashboard'),

            'shop_manager_kabuga' => redirect('/shop/kabuga'),
            'shop_manager_masaka' => redirect('/shop/masaka'),

            'store_keeper' => redirect('/stock/dashboard'),

            'baker_assistant' => redirect('/baker/dashboard'),

            'operations_manager' => redirect('/operations/dashboard'),

            'sales_coordinator' => redirect('/sales/dashboard'),

            'cicm' => redirect('/reports/dashboard'),

            'finance_chief' => redirect('/finance/dashboard'),

            default => redirect('/dashboard'),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
