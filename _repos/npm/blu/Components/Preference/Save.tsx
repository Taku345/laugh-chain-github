import { useState } from "react"
import { useView, useStore, useDelete, useGetLocalStorage } from '../../classes/apis'
import { isObject, is_json } from '../../classes/util'
import { useQueryClient } from "react-query"


// TODO: API と LocalStorage 両方に保存して、高速化

const PreferenceLocalStorage = ({
    storageKey,
    defaultPreference = [],
    onSuccess = () => {},
    onError = () => {},
}) =>
{
    const queryClient = useQueryClient()
    const { data, isLoading } = useGetLocalStorage(storageKey)

    const storePreference = (pref) =>
    {
        localStorage.setItem(storageKey, JSON.stringify(pref));
        queryClient.invalidateQueries(storageKey)
    }

    const deletePreference = () =>
    {
        localStorage.removeItem(storageKey)
        queryClient.invalidateQueries(storageKey)
    }

    /// TODO: data のチェック、最低限配列かどうか

    return {
        preference: data && is_json( data ) ? JSON.parse(data) :defaultPreference,
        storePreference,
        deletePreference,
    }
}

const PreferenceApi = ({
    storageKey,
    apiUrl,
    defaultPreference = [],
    onSuccess = () => {},
    onError = () => {},
}) =>
{
    const queryClient = useQueryClient()
    const lsData = useGetLocalStorage(storageKey)
    const { data, isLoading, isFetching } = useView(apiUrl)

    const store = useStore({
        onSuccess:(e) => {
            queryClient.invalidateQueries(apiUrl)
        },
        onError: onError,
    })
    const storePreference = (pref) =>
    {
        // localStorage.setItem(storageKey, JSON.stringify(pref));
        queryClient.invalidateQueries(storageKey)
        store.mutate({
            url: apiUrl, 
            params: {
                preference: JSON.stringify(pref)
            }
        })
    }

    const destroy = useDelete({
        onSuccess: () => {
            queryClient.invalidateQueries(apiUrl)
        },
        onError: onError,
    })
    const deletePreference = () =>
    {
        // localStorage.removeItem(storageKey)
        queryClient.invalidateQueries(storageKey)
        destroy.mutate({url: apiUrl})
    }

    if (
        (!isFetching && isObject( data ))/* &&
        (!lsData.data || !is_json( lsData.data ))*/
    )
    {
        // localStorage.setItem(storageKey, JSON.stringify(data));
        // queryClient.invalidateQueries(storageKey)
    }

    return {
        preference: !isFetching && isObject( data ) ?
            data :
            /* lsData.data && is_json( lsData.data ) ? JSON.parse(lsData.data) : */defaultPreference,
        storePreference,
        deletePreference,
    }
}



export {
    PreferenceApi,
    PreferenceLocalStorage
}