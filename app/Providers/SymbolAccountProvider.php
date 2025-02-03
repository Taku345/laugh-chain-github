<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;
use SymbolSdk\CryptoTypes\PublicKey;
use App\Models\SymbolAccount;


class SymbolAccountProvider extends ServiceProvider implements UserProvider
{
    public function retrieveById($identifier)
    {
        $facade = new SymbolFacade('testnet');
        $account = $facade->createPublicAccount(new PublicKey($identifier));

        return new SymbolAccount([
            'public_key' => $identifier,
            'address' => strval($account->address),
        ]);

        return Auth('symbol')->user();
        $sessionData = session("symbol_account_{$identifier}");

        if ($sessionData)
        {
            return new SymbolAccount([
                session('public_key'),
                session('address'),
            ]);
        }

        return null;
    }

    public function retrieveByToken($identifier, $token)
    {
        // トークン認証のロジック
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        // rememberTokenの更新処理（必要に応じて）
    }

    public function retrieveByCredentials(array $credentials)
    {
        try
        {
            $facade = new SymbolFacade('testnet');
            $account = $facade->createAccount(new PrivateKey($credentials['private_key']));
    
            return new SymbolAccount([
                'public_key' => strval($account->publicKey),
                'address' => strval($account->address),
            ]);

        }
        catch (\Exception $e)
        {
            return null;
        }
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        try
        {
            $facade = new SymbolFacade('testnet');
            $account = $facade->createAccount(new PrivateKey($credentials['private_key']));

            return $user->getAuthIdentifier() === strval($account->publicKey);
        }
        catch (\Exception $e)
        {
            return null;
        }
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false)
    {
        return null;
    }
}
