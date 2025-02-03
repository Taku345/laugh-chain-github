import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import queryString from 'query-string';
import { useIndex } from '../../classes/apis';
import { router } from '@inertiajs/react'

const useSearch = ({
    apiUrl, // Laravel 依存にしないために route ではなく url で渡す
    currentUrl = null, // デフォルトで origin + pathname で構成するが、それ以外の値を使いたい時
    replaceState = true,
}) =>
{
    const isFirstRender = useRef(true)

	const queryClient = useQueryClient();
    const parsed = replaceState ? queryString.parse(location.search, {arrayFormat: 'index'}) : {}
    const [ searchParams, setSearchParams ] = useState(parsed)
	const results = useIndex(apiUrl, searchParams)

    useEffect(() =>
    {
        if (isFirstRender.current)
        {
            isFirstRender.current = false;
            return;
        }

        if (replaceState)
        {
            currentUrl ??= window.location.origin + window.location.pathname
            const stringifyed = queryString.stringify(searchParams, {arrayFormat: 'index'});
            const url = currentUrl + (stringifyed != '' ? '?' + stringifyed : '')
            router.visit(url, { replace: true,  preserveState: true, preserveScroll: true, })
            /// history.replaceState(searchParams, null, url) Link コンポーネントで破綻するので、やってはいけない

        }
    }, [searchParams])

    return {
        queryClient,
        searchParams,
        setSearchParams,
        results,
    }
}

export default useSearch;