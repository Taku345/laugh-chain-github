<?php

namespace App\Services;

use App\Models\Election;

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

        GenerateService::newDistrict($election);
        event(new \App\Events\ElectionProgressEvent($election, config('laugh_chain.election_start_message')));

        return $election;
    }

    // スケジュールされたものを開始
    public static function start_scheduleds()
    {
        $elections = Election::scheduled();

        foreach ($elections as $election)
        {
            if (strtotime($election->scheduled_at) < strtotime(now()))
            {
                GenerateService::newDistrict($election);
                event(new \App\Events\ElectionProgressEvent($election, config('laugh_chain.election_start_message')));
            }
        }
    }
}