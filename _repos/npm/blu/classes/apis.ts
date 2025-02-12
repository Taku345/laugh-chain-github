import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import queryString from 'query-string';

const index =  async (url, params) =>
{
	const { data } = await axios.get(url, {
		params: params
	});
	return data;
}

const useIndex = (url, params) =>
{
    const stringifyed = queryString.stringify(params, {arrayFormat: 'index'});
    return useQuery([url, stringifyed], () => index(url, params), { refetchInterval: 60* 1000 });
}

// view
const view =  async (url) =>
{
	const { data } = await axios.get(url);
	return data;
}

const useView = (url) =>
{
    return useQuery([url], () => view(url));
}

const useStore = ({onSuccess, onError}) =>
{
    return useMutation(
        async ({url, params}) =>
        {
            const { data } = await axios.post(
                url,
                params,
                {
                    headers:
                    {
                        'content-type': 'multipart/form-data',
                    }
                }
            );
            return data;
        },
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );
};

const useUpdate = ({onSuccess, onError}) =>
{
    return useMutation(
        async ({url, params}) =>
        {
            const { data } = await axios.post(
                url,
                params,
                {
                    headers:
                    {
                        'content-type': 'multipart/form-data',
                        'X-HTTP-Method-Override': 'PUT',
                    }
                }
            );
            return data;
        },
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );
};

const useDelete = ({onSuccess, onError}) =>
{
    return useMutation(
        async ({url}) =>
        {
            const { data } = await axios.delete(url);
            return data;
        },
        {
            onSuccess: onSuccess,
            onError: onError,
        }
    );
}


const getLocalStorage = (key) =>
{
	const data= localStorage.getItem(key)
	return data;
}

const useGetLocalStorage = (key) =>
{
    return useQuery([key], () => getLocalStorage(key), { refetchOnWindowFocus: false });
}

export {
    useIndex, 
    useView,
    useStore,
    useUpdate,
    useDelete,
    useGetLocalStorage,
}
