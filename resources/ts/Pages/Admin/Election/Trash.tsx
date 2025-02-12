import Layout from '@/Layouts/AdminLayout'
import { useQueryClient } from 'react-query';
import PageIndex from 'blu/Laravel/Page/Index'
import { PreferenceApi, PreferenceLocalStorage } from 'blu/Components/Preference/Save'
import useForm, { toastErrors } from "blu/Laravel/classes/useForm"
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
    TITLE,
    INDEX_PREFERENCE_KEY,
    SEARCH_PREFERENCE_KEY,
    TRASH_ROUTE,
    RESTORE_ROUTE,
    ELIMINATE_ROUTE,
    ELIMINATE_MESSAGE,
    CLASS_NAME,
    TITLE_TRASH,
    CONTROL_NAME,
    CONTROL_RESTORE_LABEL,
    CONTROL_ELIMINATE_LABEL,
} from './constants'

declare var route

const Controls = ({ data }) =>
{
    const queryClient = useQueryClient()

    const { patch, delete: destroy, processing } = useForm({})

    const restoreItem = () =>
    {
        patch(route(RESTORE_ROUTE, { id: data.id} ), {
            preserveScroll: true,
            preserveState: true, // 検索の維持,
            onSuccess: () =>
            {
                queryClient.invalidateQueries()
            },
            onError: (e) =>
            {
                toastErrors(e)
            }
        })
    }

    const eliminateItem = () =>
    {
        if (confirm(`「id: ${data.id}」${ELIMINATE_MESSAGE}`))
        {
            destroy(route(ELIMINATE_ROUTE, { id: data.id} ), {
                preserveScroll: true,
                preserveState: true, // 検索の維持,
                onSuccess: () =>
                {
                    queryClient.invalidateQueries()
                },
                onError: (e) =>
                {
                    toastErrors(e)
                }
            })
        }
    }

    return (<div className='button-group'>
        <button className='small button success' disabled={processing} onClick={restoreItem}><RestoreFromTrashIcon />{CONTROL_RESTORE_LABEL}</button>
        <button className='small button delete' disabled={processing} onClick={eliminateItem}><DeleteForeverIcon />{CONTROL_ELIMINATE_LABEL}</button>
    </div>)
}

const Trash = ({
    auth,
    account,
    config,
    searchConfig = [],
    indexConfig = [],
}) =>
{
    // const searchPreference = PreferenceApi({
    //     apiUrl: route('api.preference.get', {key: SEARCH_PREFERENCE_KEY}),
    const searchPreference = PreferenceLocalStorage({
        storageKey: SEARCH_PREFERENCE_KEY,
        defaultPreference: searchConfig
    })

    // const indexPreference = PreferenceApi({
    //     apiUrl: route('api.preference.get', {key: INDEX_PREFERENCE_KEY}),
    const indexPreference = PreferenceLocalStorage({
        storageKey: INDEX_PREFERENCE_KEY,
        defaultPreference: indexConfig
    })

    return (<Layout
        auth={auth}
        account={account}
        title={`${TITLE} - ${TITLE_TRASH}`}
        className={`${CLASS_NAME} index trash`}
    >
        <PageIndex
            config={config}
            searchPreference={searchPreference}
            indexPreference={indexPreference}
            title={`${TITLE} - ${TITLE_TRASH}`}
            apiUrl={route(TRASH_ROUTE)}
            customCells={{
                '_control': {
                    type: Controls,
                    props: {},
                    label: CONTROL_NAME
                }
            }}
            replaceState={false}
        />
    </Layout>)
}

export default Trash
