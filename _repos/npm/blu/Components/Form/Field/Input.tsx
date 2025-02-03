import { FieldInputFormProps } from '../../types/Field'

const Input = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{
    return (<input
        name={name}
        className={`Input ${fieldConfig.className ?? ''}`}
        type={fieldConfig.type ?? 'text'}
        value={fieldData ?? ''} // defaultValue は必要ない、かつ undefined にすると uncontrolled になるので空文字を設定しておく。 TODO:: 0 など false の値はどうなるか
        required={fieldConfig.required ? true :false}
        placeholder={fieldConfig.placeholder ?? null}
        readOnly={fieldConfig.readonly ? true :false}
        disabled={fieldConfig.disabled ? true :false}
        autoComplete={fieldConfig.autoComplete ?? null}
        onChange={(e) => setFieldData(e.target.value)}

        style={{
            color: ['date', 'datetime-local', 'time'].includes(fieldConfig.type) && !fieldData ? 'rgb(204, 204, 204)': null, /* date の yyy/mm/dd 用 */
            width: fieldConfig.size == 'full' ? '100%': null,
        }}

        size={Number.isInteger(fieldConfig.size) ? fieldConfig.size :null}
        min={fieldConfig.min ?? null}
        max={fieldConfig.max ?? null}
        step={fieldConfig.step ?? null}
    />)
}

export default Input