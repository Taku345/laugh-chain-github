import { useState } from "react"
import { usePanelsContext } from "blu/ContextComponents/Panels"
import { PreferenceApi, PreferenceLocalStorage } from 'blu/Components/Preference/Save'
import Index from 'blu/Laravel/Page/Index'
import CloseIcon from '@mui/icons-material/Close';


const useIndexModal = ({
    apiUrl,
    referenceConfigs,
    index_preference_key,
    search_preference_key,
    customCells,
    title='',
}) =>
{
    const [ showModal, setShowModal ] = useState(false)
    const { panels, closePanel } = usePanelsContext()

    const openModal = () =>
    {
        setShowModal(true)
    }

    const closeModal = () =>
    {
        setShowModal(false)
        if (panels)
        {
            closePanel();
        }
    }

    const component = showModal && (<IndexModal
        apiUrl={apiUrl}
        referenceConfigs={referenceConfigs}
        index_preference_key={index_preference_key}
        search_preference_key={search_preference_key}
        customCells={customCells}
        closeModal={closeModal}
        title={title}
    />)|| (<></>)

    return {
        openModal,
        closeModal,
        component,
    }
}


const IndexModal = ({
    apiUrl,
    referenceConfigs,
    index_preference_key,
    search_preference_key,
    customCells,
    closeModal,
    title='',
}) =>
{
    const indexPreference = PreferenceLocalStorage({
        storageKey: index_preference_key,
        defaultPreference: referenceConfigs.index
    })

    const searchPreference = PreferenceLocalStorage({
        storageKey: search_preference_key,
        defaultPreference: referenceConfigs.search
    })

    return (<div className='Modal'
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'}}
        onClick={() => closeModal()}
    >
        <div
            className={`ModalMain`}
            onClick={(e) => e.stopPropagation()}
        >
            <header>
                <h1>{title}</h1>
                <button className="button close" onClick={() => closeModal()}><CloseIcon /></button>
            </header>
            <div className="ModalContent">
                <Index
                    config={referenceConfigs.config}
                    searchPreference={searchPreference}
                    indexPreference={indexPreference}
                    title={title}
                    apiUrl={apiUrl}
                    customCells={customCells}
                    replaceState={false}
                />
            </div>
        </div>
    </div>)

}

export default IndexModal

export {
    useIndexModal
}