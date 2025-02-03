<?php

namespace Blu\Http\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class Publish extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blu:publish';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'copy stub';

    public function handle()
    {
        (new Filesystem)->copyDirectory(
            __DIR__.'/stubs/', base_path('stubs'));
    }
}
