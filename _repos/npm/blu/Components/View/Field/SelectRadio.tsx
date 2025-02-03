import { FieldInputProps } from "../../types/Field";

const SelectRadio = ({
    fieldKey,
    fieldConfig,
    fieldData,
}: FieldInputProps) =>
{

    return (<span
        className={`Select Radio SelectRadio ${fieldKey} ${fieldConfig.className ?? ''}`}
    >
        {fieldConfig.options[fieldData] ?? ''}
    </span>)
}

export default SelectRadio