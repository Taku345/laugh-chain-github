import { FieldInputFormProps } from '../../types/Field'

const Radio = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{
    const valueNullToEmptyString = (fieldData == null) ? '': fieldData
    return (<>
        <div
            className={`Sigle Radio ${fieldConfig.className ?? ''}`}
        >
        {/* 数字と空文字が共存した際に空文字が先頭にくるように sort */}
        {Object.keys(fieldConfig.options).sort((a)=>a==''?-1:1).map((key) => (<label key={key}>
            <input
                name={name}
                type="radio"
                value={key}
                checked={valueNullToEmptyString == key ? true : false}
                required={fieldConfig.required ? true :false}
                readOnly={fieldConfig.readonly ? true :false}
                disabled={fieldConfig.disabled ? true :false}
                onChange={(e) => setFieldData(e.target.value)}
            />
            {fieldConfig.options[key]}
        </label>))}
        </div>
    {!(valueNullToEmptyString in fieldConfig.options) && (<span className='OptionError'>※範囲外の値を選択しています。({valueNullToEmptyString})</span>) }
    </>)
}

export default Radio