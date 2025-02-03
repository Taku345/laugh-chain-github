<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;
use App\Models\User;

class PrivateKeyReqeust extends FormRequest
{
    private $_user = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'private_key' => ['required', 'string', 'uppercase', 'size:64',
                function ($attribute, $value, $fail)
                {
                    try
                    {
                        $facade = new SymbolFacade('testnet');
                        $accountKey = $facade->createAccount(new PrivateKey($this->private_key));
                
                        if (!User::where('public_key', $accountKey->publicKey)->first())
                        {
                            $fail('Private Key が登録されていません。');
                        }
                    }
                    catch (\Exception $e)
                    {
                        // $fail('Private Key が登録されていません。');
                    }
                },
            ],
        ];
    }
}
