<?php

namespace App\Http\Controllers\Admin;

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
     * 秘密鍵を使用した管理者ログイン
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'private_key' => ['required', 'string', 'uppercase', 'size:64'],
        ]);

        $credentials = $request->only('private_key');

        // TODO: rate limit or use LoginRequest
        $facade = new SymbolFacade('testnet');
        $account = $facade->createAccount(new PrivateKey($request->private_key));
        if ($user = User::where('public_key', strval($account->publicKey))->first())
        {
            Auth('web')->login($user);
            session([
                'public_key' => Auth('web')->user()->public_key,
                'address' => Auth('web')->user()->address,
            ]);
            return redirect()->route('admin.dashboard');
        } else {
            return back()->withErrors(['login' => 'Invalid private key']);
        }
    }
}
