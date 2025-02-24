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
                'scene' => $election->opening_line,
                'progress' => config('laugh_chain.district.progress.close'),
            ]);
        }

        GenerateService::newDistrict($election, false);
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
                GenerateService::newDistrict($election, false);
                // main > sonoda コンフリクト時の不明個所を一旦コメントアウト
                // event(new \App\Events\ElectionProgressEvent($district->election, config('laugh_chain.election_start_message')));
                // GenerateService::newDistrict($election);
                event(new \App\Events\ElectionProgressEvent($election, config('laugh_chain.election_start_message')));
            }
        }
    }
}