<?php
namespace Blu;

use Illuminate\Support\Facades\Route;

class Routing
{
    public static function crudPage($route, $class, $name = false)
    {
        if (!$name) $name = $route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        Route::get   ($route.'',                [$class, 'index'  ])->name($name.'.index');
        Route::get   ($route.'/create',         [$class, 'create' ])->name($name.'.create');
        Route::get   ($route.'/{item}',         [$class, 'show'   ])->name($name.'.show');
        Route::get   ($route.'/{item}/edit',    [$class, 'edit'   ])->name($name.'.edit');
        Route::post  ($route.'',                [$class, 'store'  ])->name($name.'.store');
        Route::put   ($route.'/{item}',         [$class, 'update' ])->name($name.'.update');
        Route::delete($route.'/{item}',         [$class, 'destroy'])->name($name.'.destroy');
    }

    public static function softDeletePage($route, $class, $name = false)
    {
        if (!$name) $name = $route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        Route::get   ($route.'',                [$class, 'index'    ])->name($name.'.index');
        Route::get   ($route.'/trash',          [$class, 'trash'    ])->name($name.'.trash'); // soft_delete
        Route::get   ($route.'/create',         [$class, 'create'   ])->name($name.'.create');
        Route::get   ($route.'/{item}',         [$class, 'show'     ])->name($name.'.show');
        Route::get   ($route.'/{item}/edit',    [$class, 'edit'     ])->name($name.'.edit');
        Route::post  ($route.'',                [$class, 'store'    ])->name($name.'.store');
        Route::put   ($route.'/{item}',         [$class, 'update'   ])->name($name.'.update');
        Route::delete($route.'/{item}/dispose', [$class, 'dispose'  ])->name($name.'.dispose'); // soft_delete
        Route::patch ($route.'/{id}/restore',   [$class, 'restore'  ])->name($name.'.restore'); // soft_delete
        Route::delete($route.'/{id}',           [$class, 'eliminate'])->name($name.'.eliminate'); // soft_delete
    }

    public static function api($route, $class, $name = false)
    {
        if (!$name) $name = 'api.'.$route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        Route::get($route.'',        [$class, 'index'])->name($name.'.index');
        Route::get($route.'/{item}', [$class, 'show' ])->name($name.'.show');
    }

    public static function apiSoftDelete($route, $class, $name = false)
    {
        if (!$name) $name = 'api.'.$route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        Route::get($route.'',        [$class, 'index'])->name($name.'.index');
        Route::get($route.'/trash',  [$class, 'trash'])->name($name.'.trash'); // soft_delete
        Route::get($route.'/{item}', [$class, 'show' ])->name($name.'.show');
    }


    public static function crud($route, $class, $name = false)
    {
        if (!$name) $name = $route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        static::crudPage($route, $class, $name);
        Route::group(['prefix' => 'api', 'as' => 'api.'], function () use ($route, $class, $name)
        {
            static::api($route, $class, $name);
        });
    }

    public static function softDelete($route, $class, $name = false)
    {
        if (!$name) $name = $route;
        if (strpos($name, '/')) $name = str_replace('/', '.', $name);
        static::softDeletePage($route, $class, $name);
        Route::group(['prefix' => 'api', 'as' => 'api.'], function () use ($route, $class, $name)
        {
            static::apiSoftDelete($route, $class, $name);
        });
    }
}