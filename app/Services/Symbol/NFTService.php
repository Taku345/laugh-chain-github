<?php

namespace App\Services\Symbol;

use Exception;
use Illuminate\Support\Facades\Log;
use SymbolSdk\Symbol\Models\MosaicFlags;
use SymbolSdk\Symbol\IdGenerator;
use SymbolSdk\Symbol\Models\NetworkType;
use SymbolSdk\Symbol\Models\MosaicNonce;
use SymbolSdk\Symbol\Models\BlockDuration;
use SymbolSdk\Symbol\Models\UnresolvedMosaicId;
use SymbolSdk\Symbol\Models\MosaicSupplyChangeAction;
use SymbolSdk\Symbol\Models\Amount;
use SymbolSdk\Symbol\Models\EmbeddedMosaicDefinitionTransactionV1;
use SymbolSdk\Symbol\Models\EmbeddedMosaicSupplyChangeTransactionV1;
use SymbolSdk\Symbol\Models\EmbeddedTransferTransactionV1;
use SymbolSdk\Symbol\Models\MosaicId;
use SymbolSdk\Symbol\Models\AggregateCompleteTransactionV2;
use SymbolSdk\Symbol\Models\Timestamp;
use SymbolSdk\Symbol\Models\UnresolvedAddress;
use SymbolSdk\Symbol\Address;

/**
 * NFT関連のサービスクラス
 */
class NFTService
{
    /**
     * 指定アドレスアカウントのNFT一覧を取得
     * 存在しない場合は null, NFT がない場合は空配列を返す
     *
     * @param string $addressStr
     * @return array|null
     */
    public static function getAccountLaughChainNFTs(String $addressStr)
    {
        // ServiceProviderからsymbol操作用クラスを取得
        $symbol = app('symbol.config');
        $facade = $symbol['facade'];
        $accountRoutesApi = $symbol['accountRoutesApi'];
        $mosaicRoutesApi = $symbol['mosaicRoutesApi'];

        try {
            $accountInfo = $accountRoutesApi->getAccountInfo($addressStr);
        } catch (\Exception $e) {
            Log::error($e);
            return null; // アカウントが存在しない場合はnullを返すのでこれで判別してください
        }

        $accountNFTs = [];
        foreach($accountInfo->getAccount()->getMosaics() as $mosaic) {

            //getMosaics()で得られるモザイク情報はid, amountしかないため詳細情報を取得
            $mosaicInfo = $mosaicRoutesApi->getMosaic($mosaic->getId());

            if (true) { // TODO:LaughChainのNFTのみを取得する条件を追加
                throw new Exception('まだ未完成の関数だよ');
                $accountNFTs[] = $mosaicInfo;
            }
        }
        return $accountNFTs;
    }

    /**
     * NFTを発行&送信する。
     * 引数二つが存在するかのチェックは行なっていない。
     *
     * @param $StoryAddress URL or Symbolアドレス、Unsolvedかどうかわかんないので両方入れてる
     * @param $AccountAddress Accountクラスに保持してあるアドレスはUnsolvedAddress
     *
     * @return Hash256 トランザクションハッシュ
     *
     */
    private static function createMosaicFlags(): MosaicFlags
    {
        $f = MosaicFlags::NONE;
        $f += MosaicFlags::TRANSFERABLE; // 第三者への譲渡可否
        return new MosaicFlags($f);
    }

    private static function createMosaicDefinitionTx($officialAccount, $mosaicId, $flags): EmbeddedMosaicDefinitionTransactionV1
    {
        return new EmbeddedMosaicDefinitionTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $officialAccount->publicKey,
            id: new MosaicId($mosaicId['id']),
            divisibility: 0,
            duration: new BlockDuration(0),
            nonce: new MosaicNonce($mosaicId['nonce']),
            flags: $flags
        );
    }

    private static function createMosaicSupplyChangeTx($officialAccount, $mosaicId): EmbeddedMosaicSupplyChangeTransactionV1
    {
        return new EmbeddedMosaicSupplyChangeTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $officialAccount->publicKey,
            mosaicId: new UnresolvedMosaicId($mosaicId['id']),
            delta: new Amount(1),
            action: new MosaicSupplyChangeAction(MosaicSupplyChangeAction::INCREASE)
        );
    }

    private static function createNFTTransferTx($officialAccount, $AccountAddress, $StoryAddress): EmbeddedTransferTransactionV1
    {
        return new EmbeddedTransferTransactionV1(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $officialAccount->publicKey,
            recipientAddress: new UnresolvedAddress($AccountAddress),
            message: "\0$StoryAddress"
        );
    }

    private static function createAggregateTransaction($facade, $officialAccount, $embeddedTransactions): AggregateCompleteTransactionV2
    {
        $merkleHash = $facade->hashEmbeddedTransactions($embeddedTransactions);

        $aggregateTx = new AggregateCompleteTransactionV2(
            network: new NetworkType(NetworkType::TESTNET),
            signerPublicKey: $officialAccount->publicKey,
            deadline: new Timestamp($facade->now()->addHours(2)),
            transactionsHash: $merkleHash,
            transactions: $embeddedTransactions
        );
        $facade->setMaxFee($aggregateTx, 100);
        return $aggregateTx;
    }

    public static function mintNFT(
        Address|UnresolvedAddress|String $StoryAddress,
        UnresolvedAddress $AccountAddress
    ){
        // ServiceProviderからsymbol操作用クラスを取得
        $symbol = app('symbol.config');
        $facade = $symbol['facade'];
        $transactionRoutesApi = $symbol['transactionRoutesApi'];
        $officialAccount = $symbol['officialAccount'];

        $mosaicId = IdGenerator::generateMosaicId($officialAccount->address);
        $flags = self::createMosaicFlags();

        // 各トランザクションの作成
        $mosaicDefTx = self::createMosaicDefinitionTx($officialAccount, $mosaicId, $flags);
        $mosaicChangeTx = self::createMosaicSupplyChangeTx($officialAccount, $mosaicId);
        $nftTx = self::createNFTTransferTx($officialAccount, $AccountAddress, $StoryAddress);

        // アグリゲートトランザクションの作成
        $embeddedTransactions = [$mosaicDefTx, $mosaicChangeTx, $nftTx];
        $aggregateTx = self::createAggregateTransaction($facade, $officialAccount, $embeddedTransactions);

        // 署名とアナウンス
        $sig = $officialAccount->signTransaction($aggregateTx);
        $payload = $facade->attachSignature($aggregateTx, $sig);

        try {
            $result = $transactionRoutesApi->announceTransaction($payload);
            echo $result . PHP_EOL;
        } catch (Exception $e) {
            echo 'Exception when calling TransactionRoutesApi->announceTransaction: ', $e->getMessage(), PHP_EOL;
        }

        return $facade->hashTransaction($aggregateTx);
    }
}
