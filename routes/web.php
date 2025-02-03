<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;

use App\Models\Election;

use App\Http\Controllers\Api\ElectionListController;
use App\Http\Controllers\Api\ElectionController;
use App\Http\Controllers\Api\CandidacyController;
use App\Http\Controllers\Api\VoteController;

// Home
Route::get('/', function ()
{
    return Inertia::render('Home');
})->name('/');

// Login
Route::get('login', [LoginController::class, 'create'])->name('login');
Route::post('login', [LoginController::class, 'store']);
Route::middleware('auth:symbol')->group(function ()
{
    Route::post('logout', [LoginController::class, 'destroy'])
        ->name('logout');
});

// Election
Route::get('/{election}', function (Election $election)
{
    return Inertia::render('Election/index', [
        'election' => $election,
    ]);
})->name('election');


// API
Route::group(['prefix' => 'api', 'as' => 'api.'], function ()
{
    Route::get('/elections', ElectionListController::class)->name('elections');
    Route::get('/election/{election}', ElectionController::class)->name('election');
});

Route::group(['middleware' => ['auth:symbol'], 'prefix' => 'api', 'as' => 'api.'], function ()
{

    Route::post('/candidacy/{district}', CandidacyController::class)->name('candidacy');
    Route::post('/vote/{candidate}', VoteController::class)->name('vote');
});




require __DIR__.'/admin.php';
