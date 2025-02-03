<?php

namespace Blu;

use Illuminate\Support\Facades\Validator;
use DB;
use Illuminate\Support\Facades\Log;

class Controller
{
	public static $perPage = 25;

	public static function loadConfigWithRelation($config_name)
	{
		$config = config($config_name);

		// リレーションの処理
		foreach ($config as $field => $value)
		{
			if(isset($value['relation']))
			{
				if (is_string($value['relation']))
				{
					$config[$field]['relation'] = static::loadConfigWithRelation($value['relation']);
				}

				/*
				if (
					($value['type'] == 'belongsTo' || $value['type'] == 'manyMany') && // TODO: lowercase ?
					isset($value['relation']['model'])
				)
				{
					$model = $value['relation']['model'];
					$all = $model::all();
					$options = [];
					foreach ($all as $item)
					{
						$options[$item->id] = $item->{$value['relation']['model']['label']};
					
					}

					$config[$field]['options'] = $options;
				}
				*/
			}
		}

		return $config;
	}

	public static function querySearch(
		$request,
		$config,
		$q
	) // TODO: ver8 で名前つき引数に
	{
		// AND のみを提供する、もしくは TODO: where 生成用の配列を返す関数に分離
		foreach ($config as $field => $value)
		{
			if (!isset($value['search']) || $value['search'] === false) continue;

			$searches = $value['search'];
			if (!is_array($searches)) $searches = [$field => $searches];

			foreach ($searches as $key => $searchConfig)
			{
				if (!isset($request->{$key})) continue;

				if (isset($searchConfig['compare']) && $searchConfig['compare'] == false) continue; // この場合は外でやる

				$compare = isset($searchConfig['compare']) ? strtoupper($searchConfig['compare']) : '=';

				// TODO: in operator
				if (!in_array($compare, ['=', 'LIKE', '>', '<', '>=', '<=', '!='])) $compare = '=';
				$search = $compare == 'LIKE' ? '%'.$request->{$key}.'%' : $request->{$key};
				
				$searchField = isset($searchConfig['field']) ? $searchConfig['field'] : $field;

				if (strpos($searchField, '.'))
				{
					$searchFields = explode('.', $searchField);
					$q->whereHas($searchFields[0], function($q) use ($searchFields, $compare, $search)
					{
						$q->where($searchFields[1], $compare, $search);
					
					});
				}
				else
				{
					$q->where($field, $compare, $search);
				}
			}
		}

		return $q;
	}

	public static function queryOrder(
		$request,
		$config,
		$q
	)
	{
		if ($request->order && $request->orderBy)
		{
			if (isset($config[$request->orderBy]['sort']) && $config[$request->orderBy]['sort'])
			{
				if (is_string($config[$request->orderBy]['sort']))
				{
					$q->orderBy($config[$request->orderBy]['sort'], $request->order);
				}
				else
				{
					$q->orderBy($request->orderBy, $request->order);
				}
			}
		}

		return $q;
	}


	public static function querySearchOrder(
		$request,
		$config,
		$q
	)
	{
		$q = static::querySearch(
			$request,
			$config,
			$q
		);

		$q = static::queryOrder(
			$request,
			$config,
			$q
		);

		return $q;
	}

	public static function paginate(
		$request,
		$q,
		$perPage = 25
	) // TODO: ver8 で名前つき引数に
	{
		return $q->paginate($request->perPage ?: $perPage)
			->withPath( url()->current() )
			->appends($request->except('page'));
	}

	public static function searchOrderPaginate(
		$request,
		$config,
		$q,
		$perPage = 25
	)
	{
		$q = static::querySearchOrder(
			$request,
			$config,
			$q,
		);

		return static::paginate($request, $q, $perPage);
	}

	public static function itemsByRequest(
		$request,
		$config,
		$q,
		$perPage = 25
	)
	{
		return static::searchOrderPaginate($request, $config, $q, $perPage);
	}


	/*
	 * item with attributes
	 */
	public static function itemWithAttributes($item, $config)
	{
		$loads = [];
		foreach ($config as $field => $value)
		{
			if (isset($value['attribute']))
			{
				$loads[] = $value['attribute'];
				$item->{$value['attribute']};
			}

			if ($config['type'] == 'datetime-local')
			{
				$item->{$field} = $item->{$field}->format('Y-m-d\TH:i');
			}
		}

		return $item;
	}

	public static function saveTransaction($input, $item, $config, $useDefault = false, $namePrefix = '', $customs = [])
	{
		try
		{
			DB::beginTransaction();
			$result = static::save($input, $item, $config, $useDefault, $namePrefix, $customs);
			DB::commit();
		}
		catch (Throwable $e)
		{
			DB::rollBack();
			return null;
		}
		return $result;
	}


	/*
	 *
	 */
	public static function save($input, $item, $config, $useDefault = false, $namePrefix = '', $customs = [])
	{
        if (
			is_subclass_of($input, \Illuminate\Support\Collection::class) ||
			is_subclass_of($input, \Illuminate\Http\Request::class)
		)
		{
			$input = $input->all();
		}


		if (!is_array($input))
		{
			// TODO: thrtow error
		}


		// そのまま値を保存 TODO: config setting
		$default_types = [
			'text',
			'order',
			'textarea',
			'select',
			'radio',
			'checkbox',
			'number',
			'range',
			'search',
			'tel',
			'email',
			'datetime-local',
			'date',
			'time',
			'month',
			'week',
			'url',
			// 'password', どっちにしても生で保存しないので、ここでは関与しない
			'hidden',
		];

		foreach ($config as $name => $fieldConfig)
		{
			if (!$fieldConfig['type']) continue;
			if (!in_array($fieldConfig['type'], $default_types)) continue;

			if (\Arr::has($input, $namePrefix.$name))
			{
				$item->{$name} = \Arr::get($input, $namePrefix.$name);
			}
			else if ($useDefault && isset($fieldConfig['default']))
			{
				$item->{$name} = $fieldConfig['default'];
			}
		}

		$item->save();


		/*
		 * リレーションの処理
		 */
		foreach ($config as $name => $fieldConfig)
		{
			if (!$fieldConfig['type']) continue;

			if (/*!$useDefault && */!\Arr::has($input, $namePrefix.$name)) // useDefault いらない?
			{
				continue;
			}

			if (array_key_exists($fieldConfig['type'], $customs) && is_callable($customs[$fieldConfig['type']]))
			{
				$customs[$fieldConfig['type']]($name, $input, $item, $config, $useDefault, $namePrefix);
			}

			switch ($fieldConfig['type'])
			{

			case 'hasOne':
				$hasOneItem = $item->{$name};
				$hasOneUseDefault = false;
				if (!$hasOneItem)
				{
					$hasOneModel = get_class($item->{$name}()->getRelated());
					$hasOneItem = new $hasOneModel;
					$hasOneUseDefault = true;
				}
				$hasOneRules = isset($rules[$name]) ? $rules[$name] : [];

				$hasOneSaveResult = static::save($input, $hasOneItem, $fieldConfig['hasOne']['config'], $hasOneUseDefault, $namePrefix.$name.'.');
				$item->{$name}()->save($hasOneSaveResult['item']);
				break;
			case 'hasMany':
				$hasManyItems = $item->{$name} ?: [];
				$hasManyModel = get_class($item->{$name}()->getRelated());
				$hasManyRules = isset($rules[$name]) ? $rules[$name] : [];
				$hasManyPrimaryKeyName = (new $hasManyModel())->getKeyName();
				$hasManyForignKeyName = $item->{$name}()->getForeignKeyName();
				$hasManyValues = [];

				if (\Arr::has($input, $namePrefix.$name))
				{
					$hasManyValues = \Arr::get($input, $namePrefix.$name);
				}

				// 外部キーが デフォルトを持たない時のために、ないものはセットしておく (というかリレーションはこれで完結する)
				foreach ($hasManyValues as $k => $v)
				{
					if(!isset($v[$hasManyForignKeyName]))
					{
						$hasManyValues[$k][$hasManyForignKeyName] = $item->id;
					}
				}

				foreach ($hasManyItems as $hasManyItem)
				{
					// TODO: セットされていないものを削除
					if (!in_array($hasManyItem[$hasManyPrimaryKeyName], \Arr::pluck($hasManyValues, 'id')))
					{
						$hasManyValues[] = [
							$hasManyPrimaryKeyName => $hasManyItem[$hasManyPrimaryKeyName],
							'delete' => true,
						];
					}
				}

				$hasManySaveResult = static::bulkSave($input, $hasManyModel, $hasManyValues, $hasManyItems, $fieldConfig['hasMany']['config'], $namePrefix.$name.'.', $customs);
				// default は取らない
				foreach ($hasManySaveResult as $hasManySavedNewItem)
				{
					$item->{$name}()->save($hasManySavedNewItem);
				}

				break;
			case 'belongsTo':
				$belongstToModel = get_class($item->{$name}()->getRelated());

				$belongsToId = 0;
				if (\Arr::has($input, $namePrefix.$name))
				{
					$belongsToId = \Arr::get($input, $namePrefix.$name.'.'.$fieldConfig['belongsTo']['primaryKey']);
				}
				else if ($useDefault && isset($fieldConfig['default']))
				{
					$belongsToId = $fieldConfig['default'][$fieldConfig['belongsTo']['primaryKey']];
				}

				// validation required ?

				$belongsToItem = $belongstToModel::find($belongsToId);
				
				if ($belongsToItem)
				{
					$item->{$name}()->associate($belongsToItem);
				}
				else
				{
					$item->{$name}()->dissociate();
				}

				// $item->refresh(); // 必要 ? Update ではあるとダメ
				$item->save();

				break;
			case 'manyMany':
				$manyManyIds = [];
				if (\Arr::has($input, $namePrefix.$name))
				{
					$manyManyIds = \Arr::get($input, $namePrefix.$name);
				}
				else if ($useDefault && isset($fieldConfig['default']))
				{
					$manyManyIds = $fieldConfig['default'];
				}

				if (is_array($manyManyIds))
				{
					if ($live) $item->{$name}()->sync($manyManyIds);
				}

				break;
			case 'manyManyPivot':
				$manyManyPivotValues = [];
				if (\Arr::get($input, $namePrefix.$name))
				{
					$manyManyPivotValues = \Arr::get($input, $namePrefix.$name);
				}

				foreach ($manyManyPivotValues as $pivotValue)
				{
					// TODO: このままではおそらく pivot が複数の場合にダメ、
					if (isset($pivotValue['attach']))
					{
						if ($pivotValue['attach'])
						{
							if ($live)
							{
								$attachValue = [];
								$attachValue[$pivotValue['id']] = isset($pivotValue['pivot']) ? $pivotValue['pivot']: [];
								$item->{$name}()->syncWithoutDetaching($attachValue);
							}
						}
						else
						{
							if ($live) $item->{$name}()->detach($pivotValue['id']);
						}
					}
					else if (isset($pivotValue['pivot']))
					{
						if ($live)
						{
							$attachValue = [];
							$attachValue[$pivotValue['id']] = $pivotValue['pivot'];
							$item->{$name}()->syncWithoutDetaching($attachValue);
						}
					}
				}

				break;
			default:
				break;
			}
		}

		Log::debug(	$item );

		Log::debug("refresh" );
		Log::debug(get_class($item));
		Log::debug(	$item->refresh );
		Log::debug(	$item );
		$item->refresh();
		Log::debug(	$item );
		Log::debug(	$item );
		return $item;
	}
	

	public static function bulkSave($input, $model, $values, $items = [], $config, $namePrefix = '', $customs = [])
	{
		$errors = [];
		$newItems = [];

		foreach ($values as $key => $value)
		{
			// 同じ id のものを探す
			$existKey = null;
			if (isset($value['id']) && $value['id']) // TODO: pk
			{
				foreach ($items as $k => $v)
				{
					if ($v->id == $value['id'])
					{
						$existKey = $k;
						break;
					}
				}
			}

			// edit の処理
			if (! is_null($existKey)) // edit
			{
				// delete の処理
				if (isset($value['delete']) && $value['delete'])
				{
					// 
					$items[$existKey]->delete();
				}
				else
				{
					$saveResult = static::save($input, $items[$existKey], $config, false, $namePrefix.$key.'.', $customs);
				}
			}
			else // create
			{
				$newItem = new $model;
				$saveResult = static::save($input, $newItem, $config, true, $namePrefix.$key.'.', $customs);
				$newItems[] = $saveResult;
			}
		}

		return $newItems;
	}
}
