<?php

namespace App\Console\Commands\Test\Mosaic;

use Illuminate\Console\Command;

use SymbolSdk\Facade\SymbolFacade;
use SymbolSdk\CryptoTypes\PublicKey;
use SymbolRestClient\Configuration;
use SymbolRestClient\Api\AccountRoutesApi;
use SymbolRestClient\Api\MosaicRoutesApi;

use SymbolRestClient\Api\TransactionRoutesApi;
use SymbolRestClient\Model\Transaction\TransactionQueryParams;


class Create extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:mosaic-create';

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
        $this->listOwnersByMosaicId('71456D44949EA70B');
        return;

        $NODE_URL = 'http://sym-test-03.opening-line.jp:3000';
        $publicKey = '5B4B6688AF946AC6C3F5C725E6F07E3A2B7B4673881A18F95D1AFEE601B15233';

        $config = new Configuration();
        $config->setHost($NODE_URL);
        $client = new \GuzzleHttp\Client();


        $facade = new SymbolFacade('testnet');
        $account = $facade->createPublicAccount(new PublicKey($publicKey));

        $accountApiInstance = new AccountRoutesApi($client, $config);
        $mosaicApiInstance = new MosaicRoutesApi($client, $config);

        $mocaisInfo = $mosaicApiInstance->getMosaic('71456D44949EA70B');
        echo "\n===モザイク情報===" . PHP_EOL;
        dd($mocaisInfo);

        return;

        dump(strval($account->address));

        $account = $accountApiInstance->getAccountInfo($account->address);
        foreach($account->getAccount()->getMosaics() as $mosaic)
        {
            $mocaisInfo = $mosaicApiInstance->getMosaic($mosaic->getId());
            echo "\n===モザイク情報===" . PHP_EOL;
            var_dump($mocaisInfo);
        }
        
        //
    }

    public function listOwnersByMosaicId($mosaicHexId)
    {
        $NODE_URL = 'http://sym-test-03.opening-line.jp:3000';
        $config = new Configuration();
        $config->setHost($NODE_URL);
        $client = new \GuzzleHttp\Client();
        $transactionApi = new TransactionRoutesApi($client, $config);
        try {
            /*
            $queryParams = new TransactionQueryParams();
            $queryParams->setPageSize(100); // 必要に応じて調整
            $queryParams->setEmbeddedMosaicId($mosaicHexId);
            */

            $transactions = $transactionApi->searchConfirmedTransactions(
                transfer_mosaic_id: '71456D44949EA70B',
                page_size: 50,
                embedded: null
            );

            $owners = [];
            foreach ($transactions->getData() as $transaction) {
                dump($transaction);
                continue;
                foreach ($transaction->getMosaics() as $mosaic) {
                    if ($mosaic->getId()->toHex() === $mosaicHexId) {
                        $address = $transaction->getSigner()->getAddress()->getAddress();
                        $owners[$address] = ($owners[$address] ?? 0) + $mosaic->getAmount()->toBigInteger();
                    }
                }
            }

            return $owners;
        } catch (\Exception $e) {
            echo "エラー: " . $e->getMessage() . PHP_EOL;
            return [];
        }
    }
}
