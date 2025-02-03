<?php

namespace Blu\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Arr;
use Session;

use Log;
/*
 * errors のそれぞれのエラーを配列で返す
 */
class HandleInertiaRequests extends \App\Http\Middleware\HandleInertiaRequests
{
    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'errors' => function () use ($request) {
                return Arr::undot($this->resolveValidationErrorsArray($request));
            },
            'flash' => function () {
                $session = [];
                foreach ([
                    'info',
                    'success',
                    'warning',
                    'error',
                    'default',
                ] as $key)
                {
                    if (session()->has($key)) $session[$key] = session()->get($key);
                }
                return $session;
            },
        ]);
    }



    /*
     * 複数のエラーを出すのに Override
     * その代わり、デフォルトの Auth などのコンポーネントの書き換えは必要
     */
    public function resolveValidationErrorsArray(Request $request)
    {
        if (! $request->hasSession() || ! $request->session()->has('errors')) {
            return (object) [];
        }

        return (object) collect($request->session()->get('errors')->getBags())->map(function ($bag) {
            return (object) collect($bag->messages())->map(function ($errors) {
                return $errors;
            })->toArray();
        })->pipe(function ($bags) use ($request) {
            if ($bags->has('default') && $request->header('x-inertia-error-bag')) {
                return [$request->header('x-inertia-error-bag') => $bags->get('default')];
            }

            if ($bags->has('default')) {
                return $bags->get('default');
            }

            return $bags->toArray();
        });
    }

}
