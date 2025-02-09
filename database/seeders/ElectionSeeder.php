<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Election;
use App\Models\District;
use App\Models\Candidate;
use App\Models\Vote;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ElectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a sample election
        $election = Election::create([
            'name' => 'Dummy Electionダッ!!!!',
        ]);

        // Create districts
        $count = 0;
        for ($i = 1; $i <= 5; $i++) {
            $district = District::create([
                'election_id' => $election->id,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);

            // Create candidates for each district
            for ($j = 1; $j <= 3; $j++) {
                $count += 1;
                $mm = sprintf('%02d', $count);
                $candidateId = DB::table('candidates')->insertGetId([
                    'district_id' => $district->id,
                    'name' => "candidate{$count}",
                    'created_at' => "2021-04-22 12:{$mm}:30",
                ]);

                // Create sample votes
                foreach (User::all() as $user) {
                    Vote::create([
                        'candidate_id' => $candidateId,
                        'public_key' => $user->public_key,
                        'rate' => rand(1, 50), // ランダムな投票回数
                    ]);
                }
            }
        }
    }
}
