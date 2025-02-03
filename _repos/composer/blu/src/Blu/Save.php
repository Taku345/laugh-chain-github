<?php

namespace Blu;

use DB;

class Save
{
	public static function saveTransaction($input, $item, $config, $useDefault = false, $customs = [])
	{
		try
		{
			DB::beginTransaction();
			$result = static::save($input, $item, $config, $useDefault, $customs);
			DB::commit();
		}
		catch (Throwable $e)
		{
			DB::rollBack();
			return null;
		}
		return $result;
	}


	public static function bulkSaveTransaction($input, $model, $items = [], $config, $customs = [])
	{
		try
		{
			DB::beginTransaction();
			$result = static::bulkSave($input, $model, $items, $config, $customs);
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
	public static function save($input, $item, $config, $useDefault = false, $customs = [])
	{
        if (
			($input instanceof \Illuminate\Support\Collection) ||
			($input instanceof \Illuminate\Http\Request) ||
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
			'reference', // blu の独自フィールド
		];

		foreach ($config as $name => $fieldConfig)
		{
			if (!isset($fieldConfig['type']) || !$fieldConfig['type']) continue;
			if (!in_array($fieldConfig['type'], $default_types)) continue;
			if ($fieldConfig['type'] == 'reference' && !\Arr::get($fieldConfig, 'save', false)) continue;

			if (\Arr::has($input, $name))
			{
				$item->{$name} = \Arr::get($input, $name);
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
			if (!isset($fieldConfig['type']) || !$fieldConfig['type']) continue;

			if (/*!$useDefault && */!\Arr::has($input, $name)) // useDefault いらない?
			{
				continue;
			}

			if (array_key_exists($fieldConfig['type'], $customs) && is_callable($customs[$fieldConfig['type']]))
			{
				$customs[$fieldConfig['type']]($name, $input, $item, $config, $useDefault);
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
				$hasOneSaveResult = static::save(\Arr::get($input, $name), $hasOneItem, $fieldConfig['hasOne']['config'], $hasOneUseDefault);
				$item->{$name}()->save($hasOneSaveResult);
				break;
			case 'hasMany':
				$hasManyItems = $item->{$name} ?: [];
				$hasManyModel = get_class($item->{$name}()->getRelated());
				$hasManyPrimaryKeyName = (new $hasManyModel())->getKeyName();
				$hasManyForignKeyName = $item->{$name}()->getForeignKeyName();

				// 外部キーが デフォルトを持たない時のために、ないものはセットしておく (というかリレーションはこれで完結する)
				/*
				foreach ($hasManyValues as $k => $v)
				{
					if(!isset($v[$hasManyForignKeyName]))
					{
						$hasManyValues[$k][$hasManyForignKeyName] = $item->id;
					}
				}
				*/

				/*
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
				*/

				$hasManySaveResult = static::bulkSave(\Arr::get($input, $name), $hasManyModel, $hasManyItems, $fieldConfig['hasMany']['config'], $customs);
				// default は取らない
				foreach ($hasManySaveResult as $hasManySavedNewItem)
				{
					$item->{$name}()->save($hasManySavedNewItem);
				}

				break;
			case 'belongsTo':
				$belongstToModel = get_class($item->{$name}()->getRelated());

				$belongsToId = 0;
				if (\Arr::has($input, $name))
				{
					$belongsToId = \Arr::get($input, $name.'.'.( \Arr::get($fieldConfig, 'belongsTo.primaryKey', 'id') ), 0);
				}
				else if ($useDefault && isset($fieldConfig['default']))
				{
					$belongsToId = $fieldConfig['default'][( \Arr::get($fieldConfig, 'belongsTo.primaryKey', 'id') )];
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
			case 'belongsToMany':
				$belongsToManyIds = [];
				$belongsToManyModel = get_class($item->{$name}()->getRelated());
				$belongsToManyPrimaryKeyName = (new $belongsToManyModel())->getKeyName();

				if (\Arr::has($input, $name))
				{
					$belongsToManyValues = \Arr::get($input, $name, []);
					foreach ($belongsToManyValues as $belongsToManyValue)
					{
						$belongsToManyIds[] = $belongsToManyValue[$belongsToManyPrimaryKeyName];
					}
				}

				// デフォルトは送られてくるので(がy国いうと、なければわざわざ解除しているので)気にしない
				/*
				else if ($useDefault && isset($fieldConfig['default'])) // TODO:
				{
					$manyManyIds = $fieldConfig['default'];
				}
				*/

				if (is_array($belongsToManyIds))
				{
					$item->{$name}()->sync($belongsToManyIds);
				}

				break;
			case 'manyManyPivot':
				$manyManyPivotValues = [];
				if (\Arr::get($input, $name))
				{
					$manyManyPivotValues = \Arr::get($input, $name);
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

		$item->refresh();
		$item->save(); // rerun ex. for observer
		return $item;
	}
	

	public static function bulkSave($input, $model, $items = [], $config, $customs = [])
	{
		$primaryKeyName = (new $model())->getKeyName();

        if (
			($input instanceof \Illuminate\Support\Collection) ||
			($input instanceof \Illuminate\Http\Request)
		)
		{
			$input = $input->all();
		}

		foreach ($items as $item)
		{
			// TODO: セットされていないものを削除
			if (!in_array($item[$primaryKeyName], \Arr::pluck($input, $primaryKeyName)))
			{
				$input[] = [
					$primaryKeyName => $item[$primaryKeyName],
					'delete' => true,
				];
			}
		}

		// default は取らない

		$savedItems = [];

		foreach ($input as $input_key => $input_value)
		{
			// 同じ id のものを探す
			$existKey = null;
			if (isset($input_value[$primaryKeyName]) && $input_value[$primaryKeyName])
			{
				foreach ($items as $items_key => $items_value)
				{
					if ($items_value[$primaryKeyName] == $input_value[$primaryKeyName])
					{
						$existKey = $items_key;
						break;
					}
				}
			}

			// edit の処理
			if (! is_null($existKey)) // edit
			{
				// delete の処理
				if (isset($input_value['delete']) && $input_value['delete'])
				{
					// 
					$items[$existKey]->delete();
				}
				else
				{
					$saveResult = static::save($input_value, $items[$existKey], $config, false, $customs);
					$savedItems[] = $saveResult;
				}
			}
			else // create
			{
				$newItem = new $model;
				$saveResult = static::save($input_value, $newItem, $config, true, $customs);
				$savedItems[] = $saveResult;
			}
		}

		return $savedItems;
	}
}
