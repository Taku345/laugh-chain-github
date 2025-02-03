<?php

namespace App\Console\Commands\Test\Mosaic;

use Illuminate\Console\Command;

use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PrivateKey;
use SymbolSdk\CryptoTypes\PublicKey;
use SymbolRestClient\Configuration;
use SymbolSdk\Symbol\Models\TransferTransactionV1;
use SymbolSdk\Symbol\Models\MosaicId;
use SymbolSdk\Symbol\Models\UnresolvedMosaicId;
use SymbolSdk\Symbol\Models\UnresolvedMosaic;
use SymbolSdk\Symbol\Models\UnresolvedAddress;
use SymbolSdk\Symbol\Models\NetworkType;
use SymbolSdk\Symbol\Models\Timestamp;
use SymbolSdk\Symbol\Models\Amount;
use SymbolRestClient\Api\TransactionRoutesApi;

class Send extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:mosaic-send';

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

        // 公開鍵のみで送ることが可能か
        $NODE_URL = 'http://sym-test-03.opening-line.jp:3000';
        $privateKey = '';
        $facade = new SymbolFacade('testnet');
        $account = $facade->createAccount(new PrivateKey($privateKey));

        $config = new Configuration();
        $config->setHost($NODE_URL);
        $client = new \GuzzleHttp\Client();
        $apiInstance = new TransactionRoutesApi($client, $config);

        $recipientAddress = 'TCNVBODLV5QVWMDF7FY343BSUXLY6YCQYMSGJ5Y';

        $tx = new TransferTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $account->publicKey,  // 署名者公開鍵
            recipientAddress: new UnresolvedAddress($recipientAddress),  // 受信者アドレス
            mosaics: [
                new UnresolvedMosaic(
                    mosaicId: new UnresolvedMosaicId("0x1B4776674AC8C4C8"),  //5.1で作成したモザイクID
                    amount: new Amount(1) //過分性が2のため、100を指定することで送信量が1モザイクとなる
                ),
            ],
            message: "\0モザイク送信",
            deadline: new Timestamp($facade->now()->addHours(2)),
        );
        $facade->setMaxFee($tx, 100); // 手数料


        // 署名とアナウンス
        $sig = $account->signTransaction($tx);
        $payload = $facade->attachSignature($tx, $sig);

        try
        {
            $result = $apiInstance->announceTransaction($payload);
            echo $result . PHP_EOL;
        }
        catch (Exception $e)
        {
            echo 'Exception when calling TransactionRoutesApi->announceTransaction: ', $e->getMessage(), PHP_EOL;
        }
        $hash = $facade->hashTransaction($tx);
    }

    /*
     * 送信はできませんね
    */
    private static function test_public_account_send()
    {

        // 公開鍵のみで送ることが可能か
        $NODE_URL = 'http://sym-test-03.opening-line.jp:3000';
        $publicKey = '5B4B6688AF946AC6C3F5C725E6F07E3A2B7B4673881A18F95D1AFEE601B15233';
        $facade = new SymbolFacade('testnet');
        $account = $facade->createPublicAccount(new PublicKey($publicKey));

        $recipientAddress = 'TCNVBODLV5QVWMDF7FY343BSUXLY6YCQYMSGJ5Y';

        $tx = new TransferTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $account->publicKey,  // 署名者公開鍵
            recipientAddress: new UnresolvedAddress($recipientAddress),  // 受信者アドレス
            mosaics: [
                new UnresolvedMosaic(
                    mosaicId: new UnresolvedMosaicId("0x71456D44949EA70B"),  //5.1で作成したモザイクID
                    amount: new Amount(100) //過分性が2のため、100を指定することで送信量が1モザイクとなる
                ),
            ],
            message: "\0モザイク送信",
            deadline: new Timestamp($facade->now()->addHours(2)),
        );
        $facade->setMaxFee($tx, 100); // 手数料


        // 署名とアナウンス
        $sig = $account->signTransaction($tx);
        $payload = $facade->attachSignature($tx, $sig);

        try
        {
            $result = $apiInstance->announceTransaction($payload);
            echo $result . PHP_EOL;
        }
        catch (Exception $e)
        {
            echo 'Exception when calling TransactionRoutesApi->announceTransaction: ', $e->getMessage(), PHP_EOL;
        }
        $hash = $facade->hashTransaction($tx);
        //
    }
}
