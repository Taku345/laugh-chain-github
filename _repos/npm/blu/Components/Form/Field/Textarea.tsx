import { useState, useEffect, useRef } from 'react';
import { FieldInputFormProps } from '../../types/Field'

const Textarea = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{
    const [ height, setHeight ] = useState(0)
    const textAreaRef = useRef(null)

    useEffect(() =>
    {
        if (!fieldConfig?.resize && textAreaRef.current) {
            setHeight(0); // テキストエリアの高さを初期値に戻す
        }
    }, [fieldData]);

    useEffect(() =>
    {
        // 高さが初期値の場合にscrollHeightを高さに設定する
        if (!height && textAreaRef.current) {
            setHeight(textAreaRef.current.scrollHeight);
        }
    }, [height]);

    return (<textarea
        name={name}
        ref={textAreaRef}
        className={`Textarea ${fieldConfig.className ?? ''}`}
        value={fieldData ?? ''}
        required={fieldConfig.required ? true :false}
        placeholder={fieldConfig.placeholder ?? ''}
        readOnly={fieldConfig.readonly ? true :false}
        disabled={fieldConfig.disabled ? true :false}
        autoComplete={fieldConfig.autoComplete ?? ''}
        onChange={(e) => setFieldData(e.target.value)}
        cols={fieldConfig.cols ?? null}
        rows={fieldConfig.rows ?? null}
        style={{
            width: fieldConfig.size == 'full' ? '100%': null,
            height: height ? `${ height }px` : 'auto',
            resize: fieldConfig.resize ? fieldConfig.resize :'none',
        }}
    />)
}

export default Textarea