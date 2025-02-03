<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProgressJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        static::exec_progress('voted');
        static::exec_progress('voting');
        static::exec_progress('ran');
        static::exec_progress('running');
        static::exec_progress('open');
    }


}
