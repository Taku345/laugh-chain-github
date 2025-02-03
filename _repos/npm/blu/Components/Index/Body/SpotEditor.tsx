import React, { useState, Fragment, useRef, useEffect } from 'react'
import PreferenceFields from '../../../classes/preferenceFields'
import FieldInputView from "../../View/FieldInput"
import Field from "../../Form/Field"
import useForm, { toastErrors } from '../../../Laravel/classes/useForm'
import { isString } from '../../../classes/util'
import { useFields, usePreferenceFields } from './TableData'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CloseIcon from '@mui/icons-material/Close';
import { toArr, objectOnly } from '../../../classes/util'
import FieldInput from '../../../Components/Form/FieldInput'

const Editor = ({
    config,
    preference,
    preferenceKey,
    data,
    setData,
    errors,
    save,
    close,
}) =>
{
    const preferences = Array.isArray(preference[preferenceKey]) ? preference[preferenceKey] : [preference[preferenceKey]]
    const editorRef = useRef()
    const [ alignRight, setAlignRight ] = useState(false)
    const [ alignBottom, setAlignBottom ] = useState(false)

    useEffect(() => {
        const editorRect = editorRef?.current?.getBoundingClientRect()
        if (window && editorRef)
        {
            if (window.innerWidth  < (editorRect.right + 30)) {
                setAlignRight(true)
            } else {
                setAlignRight(false)
            }
            if (window.innerHeight < (editorRect.bottom + 30)) {
                setAlignBottom(true)
            } else {
                setAlignBottom(false)
            }

        }
    }, [])

    return (<div
        className='Editor'
        style={{
            position: 'absolute',
            top: alignBottom ? 'initial' : 0,
            bottom: alignBottom ? 0 : 'initial',
            left: alignRight ? 'initial' : 0,
            right: alignRight ? 0 : 'initial',
            zIndex: 100,
        }}
        ref={editorRef}
    >
        <header>
            <button className='button small' onClick={close}><CloseIcon /></button>
            <small>※このウィンドウはセルのダブルクリックでも開くことができます。</small>
        </header>
        <div className='content Form Fields'>

        {preferences.map((configKey) => (
            <Field
                key={configKey}
                fieldKey={configKey}
                config={config}
                errors={errors}
            >
                <FieldInput
                    fieldKey={configKey}
                    config={config}
                    preference={preference}
                    data={data}
                    setData={setData}
                    errors={errors}
                />
            </Field>
        ))}
        </div>
        <footer>
            <button className='button primary small' onClick={save}>保存</button>
        </footer>
    </div>)
}

export const SpotEditorRow = ({
    item,
    config,
    preference,
    primaryKey = 'id',
    data,
    setData,
    errors,
    save,
    fields={},
}) =>
{
    const [ editingField, setEditingField ] = useState(null)
    const preferenceFields = usePreferenceFields({
        config,
        data: item,
        preference,
        fields,
    })

    // edit 可能か判断
    const editable = (preferenceKey) =>
    {
        const preferences = toArr(preference[preferenceKey])

        return preferences.flat().filter((configKey) => {
            return configKey in config && config[configKey].type && config[configKey].type != 'hidden' && config[configKey].type != 'raw'
        }).length > 0
    }

    const close = () =>
    {
        setEditingField(null)
        setData({})
    }

    return (<>{Object.keys(preferenceFields).map((key) =>{
        return (<Fragment key={key}>
            {
            (
                data && editingField &&
                (item[primaryKey] == data[primaryKey]) &&
                (preference[editingField]) &&
                (key == editingField)
            ) && (<td  className={key} style={{ position: 'relative', overflow: 'visible' }}>
                    <Editor
                        config={config}
                        preference={preference}
                        preferenceKey={editingField}
                        data={data}
                        setData={(arg) => {
                            setData(arg)
                        }}
                        errors={errors}
                        save={save}
                        close={close}
                    />
                    {preferenceFields[key]}
                </td>) || (<>
                {editable(key) && (
                    <td  className={`${key} editable`} onDoubleClick={() => {
                        setData(objectOnly(item, toArr(preference[key]).concat( ['id'])))
                        setEditingField(key)
                    }}>
                        {preferenceFields[key]}
                        <button className='button small edit outline' onClick={() => {
                            setData(objectOnly(item, toArr(preference[key]).concat( ['id'])))
                            setEditingField(key)
                        }}>
                            <ModeEditIcon />
                        </button>
                    </td>
                ) || (
                    <td  className={key}>
                        {preferenceFields[key]}
                    </td>
                )}
            </>)}
        </Fragment>)
    })}
    </>)
}

const SpotEditor = ({
    config,
    preference,
    dataList,
    primaryKey = 'id',
    data,
    setData,
    errors,
    save,
}) =>
{
    return (<tbody className='SpotEditor'>
        {dataList.map((item) => (<tr>
            <SpotEditorRow
                item={item}
                config={config}
                preference={preference}
                primaryKey={primaryKey}
                data={data}
                setData={setData}
                errors={errors}
                save={save}
            />
        </tr>))}
    </tbody>)



}

export default SpotEditor