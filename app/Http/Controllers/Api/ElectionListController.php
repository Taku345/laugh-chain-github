<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Election;

class ElectionListController extends Controller
{
    public function __invoke(Request $request)
    {

        $query = Election::query();

        return \Blu\Query::itemsByRequest(
            $request,
            config('blu.election.config'),
            $query,
            25,
        );
    }

    
}
