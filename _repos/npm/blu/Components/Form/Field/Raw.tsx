import { FieldInputFormProps } from '../../types/Field'

// attribute があればその値、なければそのまま出す
const Raw = ({
    fieldConfig,
    // defaultData,
    data,
    // fieldDefaultData,
    fieldData,
    // fieldErrors,
    // setFieldData,
}: FieldInputFormProps) =>
{
    const value = 'attribute' in fieldConfig && fieldConfig['attribute'] in data ? 
        data[fieldConfig['attribute']]:
        fieldData

    return (<span
        className={`Raw ${fieldConfig.className ?? ''}`}
    >
        {value && String(value)}
    </span>)
}

export default Raw