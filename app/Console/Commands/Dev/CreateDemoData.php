<?php

namespace App\Console\Commands\Dev;

use Illuminate\Console\Command;

use App\Models\Election;
use App\Models\District;
use App\Models\Candidate;
use App\Models\Vote;

class CreateDemoData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev:create-demo-data';

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
        $demo_data = require(__DIR__.'/demo_data.php');

        
        foreach ($demo_data as $election_data)
        {
            $election = Election::create([
                'name' => $election_data['election'],
            ]);
            foreach ($election_data['districts'] as $district_index => $district_data)
            {
                $time = strtotime('-'.((count($election_data['districts']) - $district_index - 1) * 30).' second');

                $district_id = District::insertGetId([
                    'election_id' => $election->id,
                    'created_at' => Date('Y-m-d H:i:s', $time),
                    'updated_at' => Date('Y-m-d H:i:s', $time),
                ]);

                $winner = null;
                $losers = [];
                foreach ($district_data['candidates'] as $candidate_data)
                {
                    $candidate = Candidate::create([
                        'district_id' => $district_id,
                        'name' => $candidate_data,
                    ]);
                    if ($candidate_data == $district_data['winner'])
                    {
                        $winner = $candidate;
                    }
                    else
                    {
                        $losers[] = $candidate;
                    }
                }

                // 最後のデータだけ飛ばす
                if ((count($election_data['districts']) - 1) == $district_index)
                {
                    continue;
                }

                shuffle($losers);

                $vote_nums = [
                    rand(1, 5),
                    rand(6, 17),
                    rand(18, 25),
                ];
                foreach ($vote_nums as $index => $vote_num)
                {
                    if ($index == 2)
                    {
                        Vote::create([
                            'candidate_id' => $winner->id,
                            'rate' => $vote_num,
                        ]);
                    }
                    else
                    {
                        if (!isset($losers[$index])) continue;
                        Vote::create([
                            'candidate_id' => $losers[$index]->id,
                            'rate' => $vote_num,
                        ]);
                    }
                }
            }
        }

        //
    }
}
