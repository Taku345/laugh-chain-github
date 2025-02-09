<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ElectionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AiApiController;


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

    Route::get('api/ai/generate_theme', [AiApiController::class, 'generate_theme'])->name('api.ai.generate_theme');
    Route::get('api/ai/generate_themes', [AiApiController::class, 'generate_themes'])->name('api.ai.generate_themes');
    Route::get('api/ai/generate_opening_line', [AiApiController::class, 'generate_opening_line'])->name('api.ai.generate_opening_line');
    Route::get('api/ai/generate_opening_lines', [AiApiController::class, 'generate_opening_lines'])->name('api.ai.generate_opening_lines');
    Route::get('api/ai/generate_scene', [AiApiController::class, 'generate_scene'])->name('api.ai.generate_scene');
    Route::get('api/ai/generate_choices', [AiApiController::class, 'generate_choices'])->name('api.ai.generate_choices');
});


Route::middleware('guest')->group(function () {

});

Route::middleware('auth:symbol')->group(function ()
{

});