<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ElectionController;
use App\Http\Controllers\Admin\UserController;


Route::group(['middleware' => 'auth:web', 'prefix' => 'admin', 'as' => 'admin.'], function ()
{
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    \Blu\Routing::crud('election', ElectionController::class);
    Route::get('api/election_candidates', [ElectionController::class, 'candidates'])->name('api.election.candidates');
    Route::post('election/{item}/force_start', [ElectionController::class, 'force_start'])->name('election.force_start');
    

    Route::get('user', [UserController::class, 'index'])->name('user.index');
    Route::get('api/user', [UserController::class, 'index'])->name('api.user.index');
    Route::patch('api/user/{item}', [UserController::class, 'toggle_role'])->name('api.user.toggle_role');
});


Route::middleware('guest')->group(function () {

});

Route::middleware('auth:symbol')->group(function ()
{

});