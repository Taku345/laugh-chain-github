<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\District;
use App\Models\Candidate;

class CandidacyController extends Controller
{
    // POST
    public function __invoke(Request $request, District $district)
    {
        if (
            $district->progress != config('laugh_chain.district.progress.running') &&
            $district->progress != config('laugh_chain.district.progress.ran')
        )
        {
            return back()->withErrors('立候補は締め切られています。'.config('laugh_chain.district.progress.running'));
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Candidate::create([
            'district_id' => $district->id,
            'name' => $request->name,
        ]);
        event(new \App\Events\ElectionProgressEvent($district->election, '立候補がありました'));

        return back()->with('success', '立候補しました。');
    }
}
