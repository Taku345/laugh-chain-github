import React, { useEffect } from 'react'
import { useModalContext } from '../../../ContextComponents/Modal';
import { usePanelsContext } from '../../../ContextComponents/Panels';
import Index from '../../Page/Index';
import { ArrGet, isObject, toArr } from '../../../classes/util'
import isEqual from 'lodash.isequal'

const ReferenceInput = ({data, referenceInput}) =>
{
    return <button className='button' onClick={() => referenceInput(data)}>入力</button>
}

/*
 * 参照のテーブル
 */
const IndexReferenceInput = ({
    fieldKey,
    config,
    data,
    setData,

    apiUrl,
    indexConfig,
    indexPreference,
    searchPreference,
}) =>
{
    const fieldConfig = config[fieldKey]

    const { modal, openModal, closeModal } = useModalContext()
    const { panels, closePanel } = usePanelsContext()

    const exestInput = (editingData) =>
    {
        return 'reference' in fieldConfig.IndexReference && Object.keys(fieldConfig.IndexReference.reference).filter((key) => {
            return Boolean(editingData[fieldConfig.IndexReference.reference[key]]) &&
                fieldConfig.IndexReference.reference[key] in config &&
                config[fieldConfig.IndexReference.reference[key]].type &&
                config[fieldConfig.IndexReference.reference[key]].type != 'hidden'
        }).length > 0
    }

    const referenceInput = (data) =>
    {
        if (!data && !confirm('参照を解除してもよろしいですか?')) return

        const newData = {...data}
        newData[fieldKey] = data ? data: 'default' in config[fieldKey] ? config[fieldKey].default: ''

        if ('reference' in fieldConfig.IndexReference)
        {
            if (exestInput(newData))
            {
                if (confirm('すでに入力された値を上書きしますか?'))
                {
                    Object.keys(fieldConfig.IndexReference.reference).map((key) =>
                    {
                        const configKey = fieldConfig.IndexReference.reference[key];

                        newData[configKey] = data ? ArrGet(data, key) : 'default' in config[configKey] ? config[configKey].default: ''
                    })
                }
            }
            else
            {
                Object.keys(fieldConfig.IndexReference.reference).map((key) =>
                {
                    const configKey = fieldConfig.IndexReference.reference[key];
                    newData[configKey] = data ? ArrGet(data, key) : 'default' in config[configKey] ? config[configKey].default: ''
                })
            }
        }

        setData(newData)

        closeModal()
    }

    const openReferenceTable = () =>
    {
        openModal({
            title: '参照',
            content: <Index
                config={indexConfig}
                searchPreference={searchPreference}
                indexPreference={indexPreference}
                title={''}
                apiUrl={apiUrl}
                customCells={{
                    '_control': {
                        type: ReferenceInput,
                        props: {
                            referenceInput: referenceInput
                        },
                        label: '入力'
                    }
                }}
                replaceState={false}
            />,
            className: 'IndexReferenceModal',
            closeCallback: () =>
            {
                if (panels)
                {
                    closePanel();
                }
            }
        })
    }

    useEffect(() =>
    {
        if (modal)
        {
            openReferenceTable()
        }
    }, [ indexPreference, searchPreference])

    const previews = []
    
    if (fieldConfig.IndexReference?.preview && fieldKey in data && isObject(data[fieldKey]))
    {
        const previewKeys = toArr(fieldConfig.IndexReference.preview)

        previewKeys.map((previewKey) => {
            if (fieldKey in data && previewKey in data[fieldKey] && data[fieldKey][previewKey])
            {
                previews.push(data[fieldKey][previewKey])
            }
        })
    }

    return (<div className='IndexReference'>
        <div className='button-group'>
            <button className='reference button secondary' onClick={openReferenceTable}>参照</button>
            {(data[fieldKey] && (!('default' in fieldConfig) || !isEqual(data[fieldKey], fieldConfig.default))) && (<button className='button danger' onClick={() => referenceInput(null)}>解除</button>) || (<></>)}
        </div>
        {previews.length > 0 && (<span className='previews'>
            {previews.map((preview, i) => (<span className='preview' key={i}>{preview}</span>))}
        </span>)}
    </div>)

}

export default IndexReferenceInput