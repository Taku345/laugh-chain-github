<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        \Auth::provider('symbol_account', function ($app, array $config) {
            return new SymbolAccountProvider($app);
        });

        $this->app->singleton(OpenAiService::class, function ($app) {
            return new OpenAiService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
