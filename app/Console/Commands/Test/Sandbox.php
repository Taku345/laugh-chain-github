<?php

namespace App\Console\Commands\Test;

use Illuminate\Console\Command;

use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;
use SymbolSdk\Symbol\Models\MosaicSupplyRevocationTransactionV1;
use SymbolSdk\Symbol\Models\TransferTransactionV1;
use SymbolSdk\Symbol\Models\MosaicFlags;
use SymbolSdk\Symbol\Models\MosaicNonce;
use SymbolSdk\Symbol\Models\BlockDuration;
use SymbolSdk\Symbol\Models\UnresolvedMosaicId;
use SymbolSdk\Symbol\Models\UnresolvedMosaic;
use SymbolSdk\Symbol\Models\MosaicSupplyChangeAction;
use SymbolSdk\Symbol\Models\Amount;
use SymbolSdk\Symbol\IdGenerator;
use SymbolSdk\Symbol\Models\EmbeddedMosaicDefinitionTransactionV1;
use SymbolSdk\Symbol\Models\EmbeddedMosaicSupplyChangeTransactionV1;
use SymbolSdk\Symbol\Models\EmbeddedTransferTransactionV1;
use SymbolSdk\Symbol\Models\MosaicId;
use SymbolSdk\Symbol\Models\AggregateCompleteTransactionV2;
use SymbolSdk\Symbol\Models\NetworkType;
use SymbolSdk\Symbol\Models\Timestamp;
use SymbolSdk\Symbol\Models\UnresolvedAddress;
use SymbolRestClient\Configuration;
use SymbolRestClient\Api\TransactionRoutesApi;
use SymbolRestClient\Api\TransactionStatusRoutesApi;
use SymbolRestClient\Api\AccountRoutesApi;
use SymbolRestClient\Api\MosaicRoutesApi;


class Sandbox extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:sandbox';

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
        
        $NODE_URL = 'http://sym-test-03.opening-line.jp:3000';

        var_dump(NetworkType::TESTNET);
        $facade = new SymbolFacade('testnet');
        $private_key = "";
        $account = $facade->createAccount(new PrivateKey($private_key));

        $f = MosaicFlags::NONE;
        // $f += MosaicFlags::SUPPLY_MUTABLE; // 供給量変更可能
        // $f += MosaicFlags::TRANSFERABLE; // 第三者への譲渡可否
        $f += MosaicFlags::RESTRICTABLE; //制限設定の可否
        $f += MosaicFlags::REVOKABLE; //発行者からの還収可否
        $flags = new MosaicFlags($f);

        $mosaicId = IdGenerator::generateMosaicId($account->address);
        //
        $hexMosaicId = strtoupper(dechex($mosaicId['id']));
        if (strlen($hexMosaicId) === 15) {
            $hexMosaicId = '0' . $hexMosaicId;
        }
        echo $hexMosaicId . PHP_EOL;

        $mosaicDefTx = new EmbeddedMosaicDefinitionTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $account->publicKey, // 署名者公開鍵
            id: new MosaicId($mosaicId['id']), // モザイクID
            divisibility: 2, // 分割可能性
            duration: new BlockDuration(0), //duration:有効期限
            nonce: new MosaicNonce($mosaicId['nonce']),
            flags: $flags,
        );

        //モザイク変更
        $mosaicChangeTx = new EmbeddedMosaicSupplyChangeTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $account->publicKey, // 署名者公開鍵
            mosaicId: new UnresolvedMosaicId($mosaicId['id']),
            delta: new Amount(10000),
            action: new MosaicSupplyChangeAction(MosaicSupplyChangeAction::INCREASE),
        );

        // マークルハッシュの算出
        $embeddedTransactions = [$mosaicDefTx, $mosaicChangeTx];
        $merkleHash = $facade->hashEmbeddedTransactions($embeddedTransactions);

        // アグリゲートTx作成
        $aggregateTx = new AggregateCompleteTransactionV2(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $account->publicKey,
            deadline: new Timestamp($facade->now()->addHours(2)),
            transactionsHash: $merkleHash,
            transactions: $embeddedTransactions
        );
        $facade->setMaxFee($aggregateTx, 100);  // 手数料
        
        // 署名
        $sig = $account->signTransaction($aggregateTx);
        $payload = $facade->attachSignature($aggregateTx, $sig);

        /**
         * アナウンス
         */
        $config = new Configuration();
        $config->setHost($NODE_URL);
        $client = new \GuzzleHttp\Client();
        $apiInstance = new TransactionRoutesApi($client, $config);

        try {
            $result = $apiInstance->announceTransaction($payload);
            echo $result . PHP_EOL;
        } catch (Exception $e) {
            echo 'Exception when calling TransactionRoutesApi->announceTransaction: ', $e->getMessage(), PHP_EOL;
        }
    }
}
