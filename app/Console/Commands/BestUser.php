<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Election;
use Illuminate\Support\Facades\DB;

class BestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:best-user';

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
        $latest_election = Election::latest('id')->first();
        echo "ベストユーザーのPublic_keyダッ!!!" . PHP_EOL;
        dd($latest_election->best_user);
    }
}
