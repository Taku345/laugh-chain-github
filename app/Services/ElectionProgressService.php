<?php

namespace App\Services;

use App\Models\Election;
use App\Models\District;

class ElectionProgressService
{
    // 強制的に開始
    public static function force_start($election)
    {
        if (
            $election->status == 'open' || 
            $election->status == 'close'
        )
        {
            return null;
        }

        $election->is_public = true;
        $election->scheduled_at = null;
        $election->save();

        if ($election->opening_line)
        {
            District::create([
                'election_id' => $election->id,
                'name' => $election->opening_line,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);
        }

        GenerateService::newDistrict($election);
        event(new \App\Events\ElectionProgressEvent($election, config('laugh_chain.election_start_message')));

        return $election;
    }

    // スケジュールされたものを開始
    public static function start_scheduleds()
    {
        $electioins = Election::scheduled()
            ->where();

        foreach ($elections as $election)
        {
            if (strtotime($election->scheduled_at) < now())
            {
                GenerateService::newDistrict($election);
                event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.election_start_message')));
            }
        }
    }
}