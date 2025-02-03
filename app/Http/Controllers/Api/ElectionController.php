<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Election;

class ElectionController extends Controller
{
    // GET
    public function __invoke(Election $election)
    {
        return $election->load([
            'district' => function ($q)
            {
                $q->with([
                    'candidate' => function ($q)
                    {
                        $q->withSum('vote', 'rate');
                        $q->withSum('my_vote', 'rate');
                    }
                ]);
            }
        ]);
    }
}
