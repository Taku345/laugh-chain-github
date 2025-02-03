<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use SymbolSdk\CryptoTypes\PrivateKey;
use SymbolSdk\Facade\SymbolFacade;

class RandomPrivateKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:random-private-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $facade = new SymbolFacade('testnet');
        $accountKey = $facade->createAccount(PrivateKey::random());
        echo  "===秘密鍵===" . PHP_EOL;
        echo  $accountKey->keyPair->privateKey(). PHP_EOL;
    }
}
