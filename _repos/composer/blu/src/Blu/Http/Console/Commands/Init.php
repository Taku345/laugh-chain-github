<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;

class Init extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blu:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    public function handle()
    {
        exec('ls -la', $outputData, $result);
        var_dump($outputData);
        var_dump($result);

        // ./vendor/bin/sail composer require laravel/breeze --dev
        if (! $this->requireComposerPackages(['laravel/breeze'], true)) {
            return false;
        }

        // ./vendor/bin/sail artisan breeze:install react
        $this->call('breeze:install', array_filter([
            'stack' => 'react',
        ]));

        // ./vendor/bin/sail npm install ts-loader typescript --save-dev sass
        // ./vendor/bin/sail npm install && npm run dev
    }


    protected function requireComposerPackages(array $packages, $asDev = false)
    {
        $composer = $this->option('composer');

        if ($composer !== 'global') {
            $command = ['php', $composer, 'require'];
        }

        $command = array_merge(
            $command ?? ['composer', 'require'],
            $packages,
            $asDev ? ['--dev'] : [],
        );

        return (new Process($command, base_path(), ['COMPOSER_MEMORY_LIMIT' => '-1']))
            ->setTimeout(null)
            ->run(function ($type, $output) {
                $this->output->write($output);
            }) === 0;
    }
}
