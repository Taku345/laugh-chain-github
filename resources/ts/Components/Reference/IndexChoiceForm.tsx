import { useIndexModal } from "./Components/IndexModal"
import { ArrGet, isObject, toArr } from 'blu/classes/util'
import { diffs as getDiffs } from './index'
import isEqual from 'lodash.isequal'
import SimpleSearch from "./Components/SimpleSearch"

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ClearIcon from '@mui/icons-material/Clear';
import { previewsByKeys } from "./Components/Preview"



const Previews = ({
    fieldData,
    fieldConfig,
    removeChoice,
}) =>
{
    return (<ul className="Previews">
    {Array.isArray(fieldData) && (fieldData).map((rowData) => (
        <li className="flex items-center">
            <>
                {previewsByKeys(fieldConfig.IndexChoice?.preview, rowData).length > 0 && (<span className='previews Raw'>
                    {previewsByKeys(fieldConfig.IndexChoice?.preview, rowData).map((preview, i) => (<span className='preview' key={i}>{preview}</span>))}
                </span>)}
            </>
            <button className="button small delete" onClick={() => removeChoice(rowData)}><ClearIcon /></button>
        </li>
    ))}
    </ul>)
}


const ChoiceControl = ({fieldData, data: rowData, addChoice, removeChoice}) =>
{
    const isChoiced = Array.isArray(fieldData) && fieldData.filter((d) => d.id == rowData.id).length > 0

    return <>
        {isChoiced && (
            <button className='button primary min-w-20' onClick={() => removeChoice(rowData)}><CheckBoxIcon /></button>
        ) || (
            <button className='button disabled min-w-20' onClick={() => addChoice(rowData)}><CheckBoxOutlineBlankIcon /></button>
        )}
    </>
}

const IndexChoiceForm = ({
    apiUrl,
    fieldKey,
    config,
    data,
    setData,

    // 一覧画面で使う
    referenceConfigs,
    index_preference_key,
    search_preference_key,
    modalTitle='',

    refereneceOpenLabel='一覧から選ぶ',
}) =>
{
    const fieldConfig = config[fieldKey]

    const setChoices = (choices) =>
    {
        const newData = {...data}
        if (choices.length > 0)
        {
            newData[fieldKey] = choices.filter((element, index) => {
                return choices.findIndex((e) => e.id == element.id) == index
            })
        }
        else
        {
            if (fieldKey in newData) delete newData[fieldKey]
        }
        setData(newData)
    }

    const addChoice = (rowData) =>
    {
        const newChoices = Array.isArray(data[fieldKey]) ? data[fieldKey].slice() : []
        newChoices.push(rowData)
        setChoices(newChoices)
    }
    const removeChoice = (rowData) =>
    {
        const newChoices = Array.isArray(data[fieldKey]) ? data[fieldKey].filter((d) => d.id != rowData.id) : []
        setChoices(newChoices)
    }

    const customCells = {
        '_control': {
            type: ChoiceControl,
            label: '選択',
            props: {
                fieldData: data[fieldKey],
                addChoice,
                removeChoice
            },
        }
    }

    const { openModal, closeModal, component: modalComponent } = useIndexModal({
        apiUrl,
        referenceConfigs,
        index_preference_key,
        search_preference_key,
        customCells,
        title: modalTitle,
    })


    return (<div className='IndexChoice IndexChoiceForm'>

        <div className="flex flex-col justify-start items-start">

        {/* button */}
            <div className='button-group'>
                <button className='reference button secondary' onClick={openModal}>{refereneceOpenLabel}</button>
            </div>

            {/* simple search */}
            <SimpleSearch
                apiUrl={apiUrl}
                onChoice={(rowData) => {
                    addChoice(rowData)
                }}
                searchKeys={['name']}
                searchParamsDefault={ Array.isArray(data[fieldKey]) ?
                    {
                        ids_not_in: (data[fieldKey]).map((d) => d.id),
                        perPage: 5,
                    }: { prePage: 5 }
                }
            />
        </div>

        {/* preview */}
        <Previews
            fieldData={data[fieldKey]}
            fieldConfig={fieldConfig}
            removeChoice={removeChoice}
        />


        {/* modal */}
        {modalComponent}

    </div>)
}

export default IndexChoiceForm