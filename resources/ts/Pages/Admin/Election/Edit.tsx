import Layout from '@/Layouts/AdminLayoutTop'
import { PreferenceApi, PreferenceLocalStorage } from 'blu/Components/Preference/Save'
import Fields from "blu/Components/Form/Fields"
import useForm, { toastErrors } from "blu/Laravel/classes/useForm"
import confirmBeforeUnload from 'blu/Laravel/classes/confirmBeforeUnload'
import { OpenFormPreferenceSetting } from 'blu/Components/Preference/Setting'
import {
    TITLE,
    FORM_PREFERENCE_KEY,
    UPDATE_ROUTE,
    CLASS_NAME,
    TITLE_EDIT,
    LABEL_UPDATE,
} from './constants'
import customCallbacks from './Form/customCallbacks'

declare var route

const Edit = ({
    auth,
    config,
    item,
    formConfig = ['*'],
    terminalReferenceConfigs,
}) =>
{
    const { data, setData, errors, put, processing, isDirty } = useForm(item)
    confirmBeforeUnload(isDirty)
    
    const update = (e) =>
    {
        e.preventDefault();

        put(route(UPDATE_ROUTE, { item: item.id }),
        {
            onSuccess: (res) =>
            {
                // console.log('onSuccess, res')
            },
            onError: (err) =>
            {
                toastErrors(err)
            }
        });
    };

    // const formPreference = PreferenceApi({
    //     apiUrl: route('api.preference.get', {key: FORM_PREFERENCE_KEY}),
    const formPreference = PreferenceLocalStorage({
        storageKey: FORM_PREFERENCE_KEY,
        defaultPreference: formConfig
    })

    return (<Layout
        auth={auth}
        title={`${TITLE} - ${TITLE_EDIT}「id: ${item.id}」`}
        className={`${CLASS_NAME} edit`}
    >

        <section className='form edit'>
            <header>
                <h1>
                    {`${TITLE} - ${TITLE_EDIT}「id: ${item.id}」`}
                </h1>
                <OpenFormPreferenceSetting
                    config={config}
                    preference={formPreference.preference}
                    setPreference={formPreference.storePreference}
                    deletePreference={formPreference.deletePreference}
                    item={item}
                    data={data}
                    setData={setData}
                />
            </header>
            <div className="content">
                <Fields
                    config={config}
                    data={data}
                    setData={setData}
                    preference={formPreference.preference}
                    errors={errors}
                    callbacks={customCallbacks({
                        item,
                        data
                    })}
                />
            </div>
            <footer className=''>
                <button className='button primary' disabled={processing} type='submit' onClick={update}>{LABEL_UPDATE}</button>
            </footer>
        </section>
    </Layout>)
}

export default Edit
