import Select from "./Select";
import Radio from "./Radio"
import { FieldInputFormProps } from '../../types/Field'

// TODO: primary key もとれるようにしておく

export const useReference = ({
    fieldKey,
    config,
    data,
    setData,
}: FieldInputFormProps) =>
{
    const fieldConfig = config[fieldKey]

    const labelText = fieldConfig.reference['label'];
    const configForComponent = {...fieldConfig}
    configForComponent.options = {}
    Object.keys(fieldConfig.options).map((key) => configForComponent.options[key] = fieldConfig.options[key][labelText])

    const setBelongsToData = (newValue) =>
    {
        const selectedItem = newValue && newValue in fieldConfig.options ?
            fieldConfig.options[newValue] : null
        
        // reference を入力する時は setData を使う
        if ('reference' in fieldConfig.reference)
        {
            const newData = {...data}
            newData[fieldKey] = newValue
            // TODO: raw や form にないものは無視する?
            if (Object.keys(fieldConfig.reference.reference).filter((key) => {
                return Boolean(newData[fieldConfig.reference.reference[key]]) &&
                    fieldConfig.reference.reference[key] in config &&
                    config[fieldConfig.reference.reference[key]].type &&
                    config[fieldConfig.reference.reference[key]].type != 'hidden'
            }).length > 0)
            {
                if (confirm('すでに入力された値を上書きしますか?'))
                {
                    Object.keys(fieldConfig.reference.reference).map((key) =>
                    {
                        newData[fieldConfig.reference.reference[key]] = selectedItem? selectedItem[key] : null
                    })
                }
            }
            else
            {
                Object.keys(fieldConfig.reference.reference).map((key) =>
                {
                    newData[fieldConfig.reference.reference[key]] = selectedItem? selectedItem[key] : null
                })
            }
            setData(newData)
        }
        else
        {
            const newData = {...data}
            newData[fieldKey] = newValue
            setData(newData)
        }
    }


    return {
        setBelongsToData,
        configForComponent,
        fieldConfig,
    }

}

const Reference = (props) =>
{

    const {
        fieldConfig,
        fieldErrors,
        fieldData,
    } = props


    const { setBelongsToData, configForComponent } = useReference(props)

    // if (!selectedKey) fieldErrors.push('リレーションにない値を選択している可能性があります。')

    let field;
    switch (fieldConfig?.belongsTo?.type)
    {
        case 'radio':
            field = <Radio
                fieldConfig={configForComponent}
                fieldData={fieldData}
                fieldErrors={fieldErrors}
                setFieldData={setBelongsToData}
            />
            break;
        case 'select':
        default:
            field = <Select
                fieldConfig={configForComponent}
                fieldData={fieldData}
                fieldErrors={fieldErrors}
                setFieldData={setBelongsToData}
            />
            break;
    }

    return (<div className="Reference">
        {field}
        {/*!selectedKey && (<span className='error'>※範囲外の値を選択しています。</span>) */}
    </div>)
}

export default Reference