<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin {private_key?} {email?} {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'app:create-admin {private_key?} {email?} {name?}';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $facade = new SymbolFacade('testnet');

        $private_key = $this->argument('private_key') ? new PrivateKey($this->argument('private_key')) : PrivateKey::random();

        $account = $facade->createAccount($private_key);
        echo  "===秘密鍵===" . PHP_EOL;
        echo  $account->keyPair->privateKey(). PHP_EOL;
        echo  "===公開鍵===" . PHP_EOL;
        echo  $account->publicKey. PHP_EOL;
        echo "===アドレス===" . PHP_EOL;
        $accountRawAddress = $account->address;
        echo $accountRawAddress . PHP_EOL;

        User::create([
            'name' =>  $this->argument('name') ? $this->argument('name'): 'Admin',
            'email' => $this->argument('email'),

            'public_key' => $account->publicKey,
            'address' => $accountRawAddress,
            'role' => config('blockchain.role.admin'),
            'tmp_private_key' => $account->keyPair->privateKey(),
        ]);
    }
}
