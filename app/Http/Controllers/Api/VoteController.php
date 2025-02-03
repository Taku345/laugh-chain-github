<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;
use App\Models\Vote;

class VoteController extends Controller
{
    // POST
    public function __invoke(Candidate $candidate, Request $request)
    {
        \Log::info($candidate->district->progress);
        \Log::info(config('laugh_chain.distinct.progress.voting'));
        \Log::info(config('laugh_chain.distinct.progress.voted'));
        if (
            $candidate->district->progress != config('laugh_chain.district.progress.voting') &&
            $candidate->district->progress != config('laugh_chain.district.progress.voted')
        )
        {
            abort(403);
        }

        $vote = Vote::where('candidate_id', $candidate->id)
            ->where('public_key', \Auth('symbol')->user()->public_key)
            ->first();

        if ($vote)
        {
            $vote->rate = $request->rate;
            $vote->save();
        }
        else
        {
            $vote = Vote::create([
                'candidate_id' => $candidate->id,
                'rate' => $request->rate,
                'public_key' => \Auth('symbol')->user()->public_key,
            ]);
        }

        event(new \App\Events\ElectionProgressEvent($candidate->district->election, '投票がありました'));



        return $vote;
    }
}
