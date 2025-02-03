import { FieldInputProps } from "../../types/Field";

// attribute があればその値、なければそのまま出す
const Raw = ({
    fieldKey,
    fieldConfig,
    data,
    fieldData,
}: FieldInputProps) =>
{
    const value = 'attribute' in fieldConfig && fieldConfig['attribute'] in data ? 
        data[fieldConfig['attribute']]:
        fieldData

    return (<span
        className={`Raw ${fieldKey} ${fieldConfig.className ?? ''}`}
    >
        {value && String(value)}
    </span>)
}

export default Raw