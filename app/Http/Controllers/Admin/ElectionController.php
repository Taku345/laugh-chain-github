<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

// Model is used by any action
use App\Models\Election as MainModel;
// Save Request is used by store and update (post and put request)
use App\Http\Requests\ElectionRequest as SaveRequest;

use App\Services\ElectionProgressService;
use App\Models\User;

class ElectionController extends Controller
{
    protected static $perPage = 25;
    protected static $viewDir = 'Admin/Election/';
    protected static $routePrefix = 'admin.election.';
    protected static $configPrefix = 'blu.election.';

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

    public function trash(Request $request)
    {
        if ($request->expectsJson())
        {
            $query = MainModel::query()->onlyTrashed();

            return \Blu\Query::itemsByRequest(
                $request,
                static::config(),
                $query,
                static::$perPage
            );
        }

        return Inertia::render(static::$viewDir.'Trash', [
            'config' => static::config(),
            'indexConfig' => static::indexConfig(),
            'searchConfig' => static::searchConfig()
        ]);
    }

    public function show(Request $request, MainModel $item)
    {
        if ($request->expectsJson())
        {
            return $item;
        }

        return Inertia::render(static::$viewDir.'Show', [
            'config' => static::config(),
            'item' => $item,
            'formConfig' => static::formConfig(),
        ]);
    }

    public function create()
    {
        return Inertia::render(static::$viewDir.'Create', [
            'config' => static::config(),
            'formConfig' => static::formConfig(),
            'userReferenceConfigs' => config('blu.user'),
        ]);
    }

    public function edit(MainModel $item, Request $request)
    {
        return Inertia::render(static::$viewDir.'Edit', [
            'config' => static::config(),
            'item' => $item,
            'formConfig' => static::formConfig(),
            'terminalReferenceConfigs' => config('blu.terminal'),
        ]);
    }

    public function store(SaveRequest $request)
    {
        $result = \Blu\Save::saveTransaction($request, new MainModel, static::config(), $useDefault = true);

        if (!$result) return back()->withErrors('保存に失敗しました。');

        return redirect()
            ->route(static::$routePrefix.'edit', [ 'item' => $result->id ] )
            ->with('success', '保存しました。');
    }

    public function update(SaveRequest $request, MainModel $item)
    {
        $result = \Blu\Save::saveTransaction($request, $item, static::config(), $useDefault = false);

        if (!$result) return back()->withErrors('保存に失敗しました。');

        return redirect()
            ->route(static::$routePrefix.'edit', [ 'item' => $result->id ] )
            ->with('success', '更新しました。');
    }


    public function destroy(MainModel $item)
    {
        if (! $item) response()->json([], 500);

        $id = $item->id;
        $item->delete();

        return back()->with('success', '「id : '.$id.'」を削除しました。');
    }

    public function restore(int $id)
    {
        $item = MainModel::onlyTrashed()
            ->find($id);

        if (! $item) response()->json([], 500);

        $item->restore();
        return back()->with('success', '「id : '.$id.'」をゴミ箱から取り出し、元に戻しました。');
    }

    public function eliminate(int $id)
    {
        $item = MainModel::onlyTrashed()
            ->find($id);

        if (! $item) response()->json([], 500);

        $item->forceDelete();
        return back()->with('success', '「id : '.$id.'」を完全に削除しました。');
    }


    /*
     * API
     */
    public function candidates(Request $request)
    {
        if ($request->expectsJson())
        {
            $query = User::query();
            $query->where('role', '=', config('blockchain.role.candidate'));

            return \Blu\Query::itemsByRequest(
                $request,
                config('blu.user'),
                $query,
                static::$perPage
            );
        }

        aboat(404);
    }


    public function force_start(MainModel $item)
    {
        if (ElectionProgressService::force_start($item))
        {
            return back()->with('success', '選挙を開始しました。');
        }

        return back()->withErrors('開始できません。');
    }
}
