import Select from "./Select";
import Radio from "./Radio"
import { FieldInputFormProps } from '../../types/Field'


export const useBelongsTo = (props:FieldInputFormProps) =>
{
    const {
        config,
        fieldKey,
        fieldConfig,
        data,
        setData,
        fieldData,
        setFieldData,
    } = props

    const primaryKey = fieldConfig.belongsTo.primaryKey ? fieldConfig.belongsTo.primaryKey: 'id'
    const labelText = fieldConfig.belongsTo['label'];
    const configForComponent = {...fieldConfig}
    configForComponent.options = {}
    if (!('options' in fieldConfig)) fieldConfig.options = {}
    Object.keys(fieldConfig.options).map((key) => configForComponent.options[fieldConfig.options[key][primaryKey]] = fieldConfig.options[key][labelText])

    const selectedKey = fieldData && Object.keys(fieldConfig.options).find((key) => fieldConfig.options[key][primaryKey] == fieldData[primaryKey])
    const fieldDataForComponent = fieldData && selectedKey && primaryKey in fieldConfig.options[selectedKey] ?
        fieldConfig.options[selectedKey][primaryKey] : 0


    const setBelongsToData = (newValue) =>
    {
        const selectedKey =  Object.keys(fieldConfig.options).find((key) => fieldConfig.options[key][primaryKey] == newValue)
        const selectedItem = selectedKey && selectedKey in fieldConfig.options ?
            fieldConfig.options[selectedKey] : null
        
        // reference を入力する時は setData を使う
        if ('reference' in fieldConfig.belongsTo)
        {
            const newData = {...data}
            newData[fieldKey] = selectedItem
            // TODO: raw や form にないものは無視する?
            if (Object.keys(fieldConfig.belongsTo.reference).filter((key) => {
                return Boolean(newData[fieldConfig.belongsTo.reference[key]]) &&
                    fieldConfig.belongsTo.reference[key] in config &&
                    config[fieldConfig.belongsTo.reference[key]].type &&
                    config[fieldConfig.belongsTo.reference[key]].type != 'hidden'
            }).length > 0)
            {
                if (confirm('すでに入力された値を上書きしますか?'))
                {
                    Object.keys(fieldConfig.belongsTo.reference).map((key) =>
                    {
                        newData[fieldConfig.belongsTo.reference[key]] = selectedItem? selectedItem[key] : null
                    })
                }
            }
            else
            {
                Object.keys(fieldConfig.belongsTo.reference).map((key) =>
                {
                    newData[fieldConfig.belongsTo.reference[key]] = selectedItem? selectedItem[key] : null
                })
            }
            setData(newData)
        }
        else
        {
            setFieldData(selectedItem ? {...selectedItem} : null)
        }
    }


    return {
        primaryKey,
        selectedKey,
        setBelongsToData,
        configForComponent,
        fieldDataForComponent,
    }

}

const BelongsTo = (props: FieldInputFormProps) =>
{

    const {
        name,
        fieldConfig,
        fieldErrors,
    } = props


    const { selectedKey, setBelongsToData, configForComponent, fieldDataForComponent } = useBelongsTo(props)

    // if (!selectedKey) fieldErrors.push('リレーションにない値を選択している可能性があります。')

    let field;
    switch (fieldConfig?.belongsTo?.type)
    {
        case 'radio':
            field = <Radio
                name={name}
                fieldConfig={configForComponent}
                fieldData={fieldDataForComponent}
                fieldErrors={fieldErrors}
                setFieldData={setBelongsToData}
            />
            break;
        case 'select':
        default:
            field = <Select
                name={name}
                fieldConfig={configForComponent}
                fieldData={fieldDataForComponent}
                fieldErrors={fieldErrors}
                setFieldData={setBelongsToData}
            />
            break;
    }

    return (<div className="BelongsTo">
        {field}
        {/*!selectedKey && (<span className='error'>※範囲外の値を選択しています。</span>) */}
    </div>)
}

export default BelongsTo