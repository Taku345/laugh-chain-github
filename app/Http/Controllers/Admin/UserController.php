<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

// Model is used by any action
use App\Models\User as MainModel;
// Save Request is used by store and update (post and put request)
use App\Http\Requests\UserRequest as SaveRequest;

use App\Models\User;

class UserController extends Controller
{
    protected static $perPage = 25;
    protected static $viewDir = 'Admin/User/';
    protected static $routePrefix = 'admin.user.';
    protected static $configPrefix = 'blu.user.';

    /**
     * confirations
     */
    protected static function config()
    {
        $config = config(static::$configPrefix.'config');
        return $config;
    }

    protected static function indexConfig()
    {
        $config = config(static::$configPrefix.'index');
        return $config;
    }

    protected static function searchConfig()
    {
        $config = config(static::$configPrefix.'search');
        return $config;
    }

    protected static function formConfig()
    {
        $config = config(static::$configPrefix.'form');
        return $config;
    }

    /*
    * actions
    */
    public function index(Request $request)
    {
        if ($request->expectsJson())
        {
            $query = MainModel::query();
            $query->where('role', '<', config('blockchain.role.admin'));

            return \Blu\Query::itemsByRequest(
                $request,
                static::config(),
                $query,
                static::$perPage
            );
        }

        return Inertia::render(static::$viewDir.'Index', [
            'config' => static::config(),
            'indexConfig' => static::indexConfig(),
            'searchConfig' => static::searchConfig()
        ]);
    }

    public function toggle_role(MainModel $item)
    {
        $item->role = $item->role == config('blockchain.role.user') ? config('blockchain.role.candidate') :config('blockchain.role.user');

        try
        {
            \DB::beginTransaction();

            $item->save();

            \DB::commit();
        }
        catch (Throwable $e)
        {
            \DB::rollBack();
            return back()->withErrors('保存に失敗しました。');
        }

        if ($item->role == config('blockchain.role.user'))
        {
            return redirect()
                ->back()
                ->with('warning', '候補者から除外しました。');
        }

        return redirect()
            ->back()
            ->with('success', '更新しました。');
    }
}
