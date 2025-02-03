<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Election;
use App\Models\District;
use App\Services\DistrictProgressService;

class DistrictProgress extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:district-progress';

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
        \Log::info(Election::open()->count());
        if (Election::open()->count() < 1) return;

        DistrictProgressService::exec_progress('voted'); // voted -> close
        DistrictProgressService::exec_progress('voting'); // voting -> voted
        DistrictProgressService::exec_progress('ran'); // ran -> voting
        DistrictProgressService::exec_progress('running'); // running -> ran
        DistrictProgressService::exec_progress('open'); // open -> running
    }
}
