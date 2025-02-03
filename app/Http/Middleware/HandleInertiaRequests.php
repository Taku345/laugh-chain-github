<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'account' => \Auth('symbol')->user() ?
                    [
                        'public_key' => \Auth('symbol')->user()->public_key,
                        'address' => \Auth('symbol')->user()->address
                    ]:
                    null,
            ],
            'datetime' => Date('Y-m-d H:i:s'),
            'laugh_chain_config' => config('laugh_chain')
        ];
    }
}
