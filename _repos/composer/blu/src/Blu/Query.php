<?php

namespace Blu;

use Log;

class Query
{
	public static function search(
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
				// if (!$request->has($key)) continue; // TODO: 引数名と被ると許容してしまう

				if (isset($searchConfig['compare']) && $searchConfig['compare'] == false) continue; // この場合は外でやる

				$compare = isset($searchConfig['compare']) ? strtoupper($searchConfig['compare']) : '=';

				// TODO: in operator
				if (!in_array($compare, ['=', 'LIKE', '>', '<', '>=', '<=', '!=', 'in', 'IN', 'NOT IN', 'NOT_IN'])) $compare = '=';
				// $search = $compare == 'LIKE' ? '%'.$request->{$key}.'%' : $request->{$key}; // like は 下で処理
				$search = $request->{$key};
				$searchField = isset($searchConfig['field']) ? $searchConfig['field'] : $field;

				/*
				if (false && strpos($searchField, '.'))
				{
					$searchFields = explode('.', $searchField);

					$relationTable = $q->getRelation($searchFields[0])->getRelated()->getTable();

					$q->whereHas($searchFields[0], function($q) use ($searchFields, $compare, $search, $relationTable)
					{
						if (is_array($search) || in_array($compare, ['in', 'IN']))
						{
							$search = is_array($search) ? $search: [$search];
							$q->whereIn($relationTable.'.'.$searchFields[1], $search);
						}
						else
						{
							$q->where($relationTable.'.'.$searchFields[1], $compare, $search);
						}
					});
				}
				*/
				if (strpos($searchField, '.'))
				{
					$searchFields = explode('.', $searchField);
					$q->whereHas($searchFields[0], function ($q) use ($searchFields, $compare, $search)
					{
						if (in_array(strtoupper($compare), ['NOT IN', 'NOT_IN']))
						{
							$search = is_array($search) ? $search: [$search];
							// $q->whereIn($q->getModel()->getTable().'.'.$searchField, $search);
							$q->whereNotIn($searchField, $search);
						}
						else if (is_array($search) || in_array($compare, ['in', 'IN']))
						{
							$search = is_array($search) ? $search: [$search];
							$q->whereIn($searchFields[1], $search);
						}
						else if (in_array(strtoupper($compare), ['LIKE']))
						{
							$likeSearches = explode(' ', trim(preg_replace('/\s+/', ' ', $search)));
							$q->where(function ($q) use ($searchFields, $compare, $likeSearches)
							{
								$q->where($searchFields[1], $compare, '%'.$likeSearches[0].'%');
								for ($i = 1; $i < count($likeSearches); $i++)
								{
									$q->where($searchFields[1], $compare, '%'.$likeSearches[$i].'%');
								}
							});
						}
						else
						{
							$q->where($searchFields[1], $compare, $search);
						}
					});
				}
				else
				{
					if (in_array(strtoupper($compare), ['NOT IN', 'NOT_IN']))
					{
						$search = is_array($search) ? $search: [$search];
						// $q->whereIn($q->getModel()->getTable().'.'.$searchField, $search);
						$q->whereNotIn($searchField, $search);
					}
					else if (is_array($search) || in_array($compare, ['in', 'IN']))
					{
						$search = is_array($search) ? $search: [$search];
						// $q->whereIn($q->getModel()->getTable().'.'.$searchField, $search);
						$q->whereIn($searchField, $search);
					}
					else if (in_array(strtoupper($compare), ['LIKE']))
					{
						$likeSearches = explode(' ', trim(preg_replace('/(\s|　)+/', ' ', $search)));
						$q->where(function ($q) use ($searchField, $compare, $likeSearches)
						{
							$q->where($searchField, $compare, '%'.$likeSearches[0].'%');
							for ($i = 1; $i < count($likeSearches); $i++)
							{
								$q->where($searchField, $compare, '%'.$likeSearches[$i].'%');
							}
						});
					}
					else
					{
						// $q->where($q->getModel()->getTable().'.'.$searchField, $compare, $search);
						$q->where($searchField, $compare, $search);
					}
				}
			}
		}

		// Log::info('$q->toSql()');
		// Log::info(preg_replace_array('/\?/', $q->getBindings(), $q->toSql()));
		return $q;
	}

	public static function order(
		$request,
		$config,
		$q
	)
	{
		if ($request->order && $request->orderBy) // TODO:: 再帰的に
		{
			if (isset($config[$request->orderBy]['sort']) && $config[$request->orderBy]['sort'] == false) return $q;

			if (isset($config[$request->orderBy]['sort']) && $config[$request->orderBy]['sort'])
			{
				if (is_string($config[$request->orderBy]['sort']))
				{
					if (strpos($config[$request->orderBy]['sort'], '.'))
					{
						$orderFields = explode('.', $config[$request->orderBy]['sort']);
						$related = $q->getModel()->{$orderFields[0]}();
						$relationModel = $related->getRelated();

						$ownerTable = $q->getModel()->getTable();
						$foreignKeyName = $related->getForeignKeyName();
						$relationKeyName = $related->getOwnerKeyName();
						$relationTableName = $relationModel->getTable();

						$q->leftJoin($relationTableName, $relationTableName.'.'.$relationKeyName, '=', $ownerTable.'.'.$foreignKeyName)
							->orderBy($relationTableName.'.'.$orderFields[1], $request->order);
						// Log::info($q->toSql());
					}
					else
					{
						$q->orderBy($config[$request->orderBy]['sort'], $request->order);
					}
				}
				else
				{
					$q->orderBy($request->orderBy, $request->order);
				}
			}
		}

		return $q;
	}


	public static function searchOrder(
		$request,
		$config,
		$q
	)
	{
		$q = static::search(
			$request,
			$config,
			$q
		);

		$q = static::order(
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
		$q = static::searchOrder(
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
}
