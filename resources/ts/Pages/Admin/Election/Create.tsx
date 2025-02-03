import Layout from '@/Layouts/AdminLayoutTop'
import Fields from "blu/Components/Form/Fields"
import { defaultDataFromConfig } from "blu/classes/model"
import { PreferenceApi, PreferenceLocalStorage } from 'blu/Components/Preference/Save'
import useForm, { toastErrors } from "blu/Laravel/classes/useForm"
import confirmBeforeUnload from 'blu/Laravel/classes/confirmBeforeUnload'
import { OpenFormPreferenceSetting } from 'blu/Components/Preference/Setting'
import {
    TITLE,
    FORM_PREFERENCE_KEY,
    STORE_ROUTE,
    CLASS_NAME,
    TITLE_CREATE,
    LABEL_STORE,

} from './constants'
import customCallbacks from './Form/customCallbacks'

declare var route

const Create = ({
    auth,
    config,
    formConfig = ['*'],
    userReferenceConfigs,
}) =>
{
    const item = defaultDataFromConfig(config)
    const { data, setData, errors, post, processing, isDirty } = useForm(item)
    confirmBeforeUnload(isDirty)

    const create = (e) =>
    {
        e.preventDefault();

        post(route(STORE_ROUTE), {
            onSuccess: (res) =>
            {
                // console.log('onSuccess', res)
            },
            onError: (err) =>
            {
                toastErrors(err)
            },
        });
    }

    // const formPreference = PreferenceApi({
    //     apiUrl: route('api.preference.get', {key: FORM_PREFERENCE_KEY}),
    const formPreference = PreferenceLocalStorage({
        storageKey: FORM_PREFERENCE_KEY,
        defaultPreference: formConfig
    })


    return (<Layout
        auth={auth}
        title={`${TITLE} - ${TITLE_CREATE}`}
        className={`${CLASS_NAME} create`}
    >

        <section className='form create'>
            <header>
                <h1>
                    {`${TITLE} - ${TITLE_CREATE}`}
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
                        item: item,
                        userReferenceConfigs,
                    })}
                />
            </div>
            <footer className=''>
                <button className='button primary' disabled={processing} type='submit' onClick={create}>{LABEL_STORE}</button>
            </footer>
        </section>
    </Layout>)
}

export default Create
