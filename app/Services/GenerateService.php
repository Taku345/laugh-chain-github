<?php

namespace App\Services;

use App\Models\District;
use App\Models\Candidate;

use App\Jobs\GenerateDistrictContentsJob;
use App\Jobs\GenerateCandidateContentsJob;

class GenerateService
{
    public static function newDistrict($election, $climaxFlag)
    {
        if(!$climaxFlag){
            // district を作る
            $new_district = District::create([
                'election_id' => $election->id,
            ]);
            \Log::info('District created: '.$new_district->id);


            // TODO: 作成した district に対して AI で生成する job を投げておく
            // TODO: AI と JOB 化

            GenerateDistrictContentsJob::dispatch($new_district);

            GenerateCandidateContentsJob::dispatch($new_district);

            //  static::generateCandidateAndCreate($new_district);
        } else {

            // もうええわ！
            $new_district = District::create([
                'election_id' => $election->id,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);
            \Log::info('climax created: '.$new_district->id);

            GenerateDistrictContentsJob::dispatch($new_district);

            Candidate::create([
                'district_id' => $new_district->id,
                'name' => config('laugh_chain.close_keyward'),
            ]);
        }

        return $new_district;
    }

    /*
    public static function  generateCandidateAndCreate($district)
    {
        $candidates = static::generateCandidate();
        foreach ($candidates as $candidate)
        {
            Candidate::create([
                'district_id' => $district->id,
                'name' => $candidate,
            ]);
        }
    }
 
 
    public static function generateCandidate()
    {
        return [
            'test A',
            'test B',
            'test C',
        ];
    }
        */
}