<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use SymbolSdk\Symbol\Models\PublicKey;
use App\Services\Symbol\NFTService;
use Illuminate\Support\Facades\Log;

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
        $txHash = NFTService::mintNFT(config('app.url') . '/election/' , new PublicKey(config('test_user_keys.test_user_1.public_key')));
        Log::info("mintNFT txHash: " . $txHash);
        dump("mintNFT txHash: " . $txHash);
        dump(config('app.url'));
    }
}
