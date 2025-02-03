<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;

class SymbolAccount implements Authenticatable
{
    private $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function getAuthIdentifierName()
    {
        return 'public_key';
    }

    public function getAuthIdentifier()
    {
        return $this->attributes['public_key'];
    }

    public function getAuthPasswordName()
    {
        return null;
    }

    public function getAuthPassword()
    {
        return null; // パスワードを使わない場合
    }
    

    public function getRememberToken()
    {
        return null; // トークンを使わない場合
    }

    public function setRememberToken($value)
    {
        // rememberTokenを使わない
    }

    public function getRememberTokenName()
    {
        return null;
    }

    public function __get($key)
    {
        return $this->attributes[$key] ?? null;
    }
}
