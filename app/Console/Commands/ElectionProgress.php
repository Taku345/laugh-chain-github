<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ElectionProgressService;

class ElectionProgress extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:election-progress';

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
        ElectionProgressService::start_scheduleds();
    }
}
