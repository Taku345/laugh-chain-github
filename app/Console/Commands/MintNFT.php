<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use SymbolSdk\Symbol\Models\PublicKey;
use App\Services\Symbol\NFTService;

class MintNFT extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mint-nft';

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
        NFTService::mintNFT("localhost/test1",new PublicKey(config('test_user_keys.test_user_1.public_key')));
    }
}
