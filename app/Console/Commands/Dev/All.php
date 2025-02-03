<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;
use SymbolSdk\CryptoTypes\PrivateKey;

class All extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:all {admin_private_key?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '開発用 - データベースをりせっとして、デモ用のユーザー作成とでもデータの生成';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('migrate:refresh');
        $this->call('app:create-admin', ['private_key' => $this->argument('admin_private_key')]);
        $this->call('dev:create-demo-data');
    }
}
