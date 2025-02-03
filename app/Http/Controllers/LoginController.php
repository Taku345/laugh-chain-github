<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'private_key' => ['required', 'string', 'uppercase', 'size:64'],
        ]);

        $credentials = $request->only('private_key');

        if (Auth('symbol')->attempt($credentials))
        {
            session([
                'public_key' => Auth('symbol')->user()->public_key,
                'address' => Auth('symbol')->user()->address,
            ]);

            // 管理者であれば、Admin にログイン
            // TODO: rate limit or use LoginRequest
            $facade = new SymbolFacade('testnet');
            $account = $facade->createAccount(new PrivateKey($request->private_key));
            if ($user = User::where('public_key', strval($account->publicKey))->first())
            {
                Auth('web')->login($user);
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('/');
        }

        return back()->withErrors(['login' => 'Invalid private key']);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        Auth::guard('symbol')->logout();

        session()->flush();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
