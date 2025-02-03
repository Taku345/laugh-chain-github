import { FieldInputFormProps } from '../../types/Field'

const Select = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{

    const valueNullToEmptyString = (fieldData == null) ? '': fieldData
  
    return (<>
        <select
            name={name}
            className={`Sigle Select ${fieldConfig.className ?? ''}`}
            value={valueNullToEmptyString}
            required={fieldConfig.required ? true :false}
            disabled={fieldConfig.disabled ? true :false}
            onChange={(e) => setFieldData(e.target.value)}
        >
        {/* 数字と空文字が共存した際に空文字が先頭にくるように sort */}
        {Object.keys(fieldConfig.options).sort((a)=>a==''?-1:1).map((key) => (
            <option value={key} key={key}>
                {fieldConfig.options[key]}
            </option>
        ))}
        </select>
        {!(valueNullToEmptyString in fieldConfig.options) && (<span className='OptionError'>※範囲外の値を選択しています。({valueNullToEmptyString})</span>) }
    </>)
}

export default Select