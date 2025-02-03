import React, { useState, useCallback, useEffect } from 'react'
import { usePanelsContext } from '../../ContextComponents/Panels'
import GroupingSortable from './GroupingSortable'
import isEqual from 'lodash.isequal'
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

export const PreferencePanel = ({
    config,
    preference,
    okHandler,
    applyHandler,
    cancelHandler,
    resetHandler,
    title
}) =>
{
    const [elements, setElements] = useState(preference)

    const SortableRender = ({
        data,
    }) =>
    {
        return (<span>
            {data in config ? config[data].label : data == '*' ? '* 全て':data}
        </span>)
    }

    const elementsLibrary = Object.keys(config).map((ck) => ck)

    return (<div>
        <header className='panel-drag flex justify-between items-center'>
            <h1>{title}</h1>
            <button className='button small' onClick={cancelHandler} title='閉じる'><CloseIcon /></button>
		</header>
        <div className='flex justify-between'>
        <GroupingSortable
            elements={elements}
            setElements={setElements}
            renderComponent={SortableRender}
            elementsLibrary={elementsLibrary}
        />
        </div>
        <footer>
            <button className='button small' onClick={() => okHandler(elements)}>OK</button>
            <button className='button small' onClick={() => applyHandler(elements)}>適用</button>
            <button className='button small' onClick={() => {
                //setElements(preference)
                resetHandler()
            }}>初期化(設定の削除)</button>
        </footer>
    </div>)
}


const toPreferenceConfig = (config) =>
{
    let formConfig = {}

    for (let key in config)
    {
        if (!('type' in config[key]) || config[key].type == 'hidden')
        {
            continue
        }

        formConfig[key] = {...config[key]}

        if (config[key].type === false)
        {
            formConfig[key].label = ('label' in formConfig[key] ? formConfig[key].label : key) + '(*閲覧時のみ表示されます)'
        }
    }

    return formConfig
}

const toSearchConfig = (config) =>
{
    let formConfig = {}

    for (let key in config)
    {
        if (!('search' in config[key]))
        {
            continue
        }

        for (let searchKey in config[key].search)
        {
            formConfig[searchKey] = {...config[key].search[searchKey]}
        }
    }

    return formConfig
}


export const OpenFormPreferenceSetting = ({
    config,
    configBefore={},
    configAfter={
        '*': { label: '*残り全て' }
    },
    preference,
    setPreference,
    deletePreference,
    item,
    data = null,
    setData = null,
    panelId = 'form-preference-setting-panel',
}) =>
{
    const { openPanel, closePanel } = usePanelsContext()

    const [ updatePreference, setUpdatePreference ] = useState(null)

    const formConfig = {
        ...configBefore,
        ...toPreferenceConfig(config),
        ...configAfter,
    }

    useEffect(() =>
    {
        if (!updatePreference) return

        if (data && setData)
        {
            // 適用の際に、編集データのリセットの確認
            if (
                !isEqual(item, data) &&
                Object.keys(config).filter((ck) => {
                    return !updatePreference.preference.flat().includes(ck) && !isEqual(item[ck], data[ck])
                }).length > 0
            )
            {
                if (!confirm('編集中のデータで非表示のものは値がリセットされます。'))
                {
                    return
                }

                const newData = {...data}
                Object.keys(config).filter((ck) => {
                    return !updatePreference.preference.flat().includes(ck) && !isEqual(item[ck], data[ck])
                }).map((ck) =>
                {
                    if (ck in item)
                    {
                        newData[ck] = item[ck]
                    }
                    else
                    {
                        delete newData[ck]
                    }
                })
                setData(newData)
            }
        }

        setPreference(updatePreference.preference)
        if (updatePreference.close) closePanel(panelId)

    }, [updatePreference])


    const openFormPreferenceSettingPanel = () =>
    {
        openPanel({
            id: panelId,
            component: <PreferencePanel
                title='フォーム設定'
                config={formConfig}
                preference={updatePreference ? updatePreference.preference : preference}
                okHandler={(elements) => setUpdatePreference({ preference: elements, close: true })}
                applyHandler={(elements) => setUpdatePreference({ preference: elements, close: false })}
                cancelHandler={() => closePanel(panelId)}
                resetHandler={() => {
                    closePanel(panelId)
                    setUpdatePreference(null)
                    deletePreference()
                }}
            />,
            width: 800,
            height: 800,
            x: 10,
            y: 10,
            right: true,
        })
    }

    return <button
        className='button small'
        onClick={openFormPreferenceSettingPanel}
        title='フォーム設定を開く'
    >
        <SettingsIcon />
    </button>
}



export const OpenIndexPreferenceSetting = ({
    config,
    configBefore={},
    configAfter={},
    preference,
    setPreference,
    deletePreference = null,
    panelId = 'index-preference-setting-panel',
}) =>
{
    const indexConfig = {
        ...configBefore,
        ...toPreferenceConfig(config),
        ...configAfter,
    }

    return (<OpenPreferenceSetting
        title = '一覧表示設定'
        configForPreference={indexConfig}
        preference={preference}
        setPreference={setPreference}
        panelId={panelId}
        deletePreference={deletePreference}
    />)
} 

export const OpenSearchPreferenceSetting = ({
    config,
    configBefore={},
    configAfter={},
    preference,
    setPreference,
    panelId = 'search-preference-setting-panel',
    deletePreference,
}) =>
{
    const searchConfig = {
        ...configBefore,
        ...toSearchConfig(config),
        ...configAfter,
    }

    return (<OpenPreferenceSetting
        title = '検索設定'
        configForPreference={searchConfig}
        preference={preference}
        setPreference={setPreference}
        panelId={panelId}
        deletePreference={deletePreference}
    />)
}


const OpenPreferenceSetting = ({
    title = '',
    configForPreference,
    preference,
    setPreference,
    panelId,
    deletePreference,
}) =>
{
    const { openPanel, closePanel } = usePanelsContext()

    const [ updatePreference, setUpdatePreference ] = useState(null)

    useEffect(() =>
    {
        if (!updatePreference) return

        setPreference(updatePreference.preference)
        if (updatePreference.close) closePanel(panelId)
    }, [updatePreference])


    const openPreferenceSettingPanel = () =>
    {
        openPanel({
            id: panelId,
            component: <PreferencePanel
                title={title}
                config={configForPreference}
                preference={updatePreference ? updatePreference.preference : preference}
                okHandler={(elements) => setUpdatePreference({ preference: elements, close: true })}
                applyHandler={(elements) => setUpdatePreference({ preference: elements, close: false })}
                cancelHandler={() => closePanel(panelId)} 
                resetHandler={() => {
                    closePanel(panelId)
                    setUpdatePreference(null)
                    deletePreference()
                }}
            />,
            width: 800,
            height: 500,
            x: 10,
            y: 10,
            right: true,
        })
    }

    return <button
        className='button small'
        onClick={openPreferenceSettingPanel}
        title={`${title}を開く`} >
            <SettingsIcon />
    </button>
}