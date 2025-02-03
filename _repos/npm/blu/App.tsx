import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePage } from '@inertiajs/react'
import { ModalContextProvider } from './ContextComponents/Modal'
import { PanelsContextProvider } from './ContextComponents/Panels'

const BluContext = createContext({} as {
	confirmBeforeunload: boolean,
	setConfirmBeforeunload: React.Dispatch<React.SetStateAction<{}>>,
})

const BluContextProvider = ({
    children
}) =>
{
	const [ _confirmBeforeunload, _setConfirmBeforeunload ] = useState({
		state: false,
		url: '',
	})

	const setConfirmBeforeunload = (isConfirm) =>
	{
		_setConfirmBeforeunload({
			state: isConfirm,
			url: location.href,
		})
	}

	const confirmUnload = (e) =>
    {
        if (_confirmBeforeunload.url == location.href && _confirmBeforeunload.state)
        {
            e.preventDefault();
            e.returnValue = 'ページを移動してもよろしいですか？\n※編集中のものは保存されません';
        }
    }
	
    useEffect(() =>
	{
        window.addEventListener('beforeunload', confirmUnload)
		window.addEventListener('popstate', confirmUnload)
        return () => {
            window.removeEventListener('beforeunload', confirmUnload)
            window.removeEventListener('popstate', confirmUnload)
        }
    }, [_confirmBeforeunload])
	
	return (
		<BluContext.Provider value={{ /* callbacks, setCallbacks, */ confirmBeforeunload : _confirmBeforeunload.url == location.href && _confirmBeforeunload.state, setConfirmBeforeunload }}>
			{children}
		</BluContext.Provider>
	)
}

export const useBluContext = () => useContext(BluContext)

export const FlashMessage = () =>
{
	const { flash } = usePage().props
	useEffect(() =>
	{
		flash && 'info'    in flash && toast.info(flash['info'], flash['info'])
		flash && 'success' in flash && toast.success(flash['success'], flash['success'])
		flash && 'warn'    in flash && toast.warn(flash['warn'], flash['success'])
		flash && 'warning' in flash && toast.warn(flash['warning'], flash['success'])
		flash && 'error'   in flash && toast.error(flash['error'], flash['success'])
		flash && 'default' in flash && toast(flash['default'], flash['success'])

	}, [flash])
}

export const BluApp = ({
	className='blu',
	children,
}) =>
{
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				// cacheTime: 1000,
			},
			mutations: {
				retry: false,
			},
		}
	})

	return (<div className={className}>
        <QueryClientProvider client={queryClient}>
			<BluContextProvider>
			<PanelsContextProvider>
			<ModalContextProvider>
				{children}
			</ModalContextProvider>
			</PanelsContextProvider>
			</BluContextProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ToastContainer />
	</div>)
}

export default BluApp
