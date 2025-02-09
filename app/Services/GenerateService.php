<?php

namespace App\Services;

use App\Models\District;
use App\Models\Candidate;

use App\Jobs\GenerateDistrictContentsJob;

class GenerateService
{
    public static function newDistrict($election)
    {
        // district を作る
        $new_district = District::create([
            'election_id' => $election->id,
        ]);



        // TODO: 作成した district に対して AI で生成する job を投げておく
        // TODO: AI と JOB 化

        GenerateDistrictContentsJob::dispatch($new_district);

        //  static::generateCandidateAndCreate($new_district);

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