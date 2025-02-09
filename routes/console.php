<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\DistrictProgressJob;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::command('app:district-progress')->everySecond()->withoutOverlapping();
Schedule::command('app:election-progress')->everyFiveSeconds()->withoutOverlapping();
// Schedule::command('queue:work')->everySecond()->withoutOverlapping();
