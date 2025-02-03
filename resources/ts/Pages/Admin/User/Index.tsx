import Layout from '@/Layouts/AdminLayout'
import { useQueryClient } from 'react-query';
import { Link } from '@inertiajs/react';
import PageIndex from 'blu/Laravel/Page/Index'
import useForm, { toastErrors } from "blu/Laravel/classes/useForm"
import { PreferenceApi, PreferenceLocalStorage } from 'blu/Components/Preference/Save'
import ShowIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

import {
    TITLE,
    INDEX_PREFERENCE_KEY,
    SEARCH_PREFERENCE_KEY,
    API_ROUTE,
    SHOW_ROUTE,
    EDIT_ROUTE,
    DELETE_ROUTE,
    DELETE_MESSAGE,
    CLASS_NAME,
    TITLE_INDEX,
    CONTROL_NAME,
    CONTROL_SHOW_LABEL,
    CONTROL_EDIT_LABEL,
    CONTROL_DELETE_LABEL,
} from './constants'

declare var route

const Controls = ({ data }) =>
{
    const queryClient = useQueryClient()
    const { patch, processing } = useForm({})

    const toggleRole = () =>
    {
        patch(route('admin.api.user.toggle_role', { item: data.id} ), {
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

    const isCandidate = data.role > 0

    return (<div className='button-group'>
        <button className={`small button ${isCandidate ? 'green' : ''}` } disabled={processing} onClick={toggleRole}>
            {isCandidate && (<>
                <ToggleOnIcon />candidate
            </>) || (<>
                <ToggleOffIcon />voter
            </>)}
        </button>
    </div>)
}

const Index = ({
    auth,
    config,
    searchConfig = [],
    indexConfig = [],
}) =>
{
    // const searchPreference = PreferenceApi({
        // apiUrl: route('api.preference.get', {key: SEARCH_PREFERENCE_KEY}),
    const searchPreference = PreferenceLocalStorage({
        storageKey: SEARCH_PREFERENCE_KEY,
        defaultPreference: searchConfig
    })

    // const indexPreference = PreferenceApi({
        // apiUrl: route('api.preference.get', {key: INDEX_PREFERENCE_KEY}),
    const indexPreference = PreferenceLocalStorage({
        storageKey: INDEX_PREFERENCE_KEY,
        defaultPreference: indexConfig
    })

    return (<Layout
        auth={auth}
        title={`${TITLE} - ${TITLE_INDEX}`}
        className={`${CLASS_NAME} index`}
    >

        <PageIndex
            config={config}
            searchPreference={searchPreference}
            indexPreference={indexPreference}
            title={TITLE}
            apiUrl={route(API_ROUTE)}
            customCells={{
                '_control': {
                    type: Controls,
                    props: {},
                    label: CONTROL_NAME
                },
                /*
                '_control_price': {
                    type: ControlPrice,
                    props: {},
                    label: '個別金額設定'
                }
                */
            }}
        />
    </Layout>)
}

export default Index
