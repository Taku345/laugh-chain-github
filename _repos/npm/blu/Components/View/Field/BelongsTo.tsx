import SelectRadio from "./SelectRadio";
import { FieldInputProps } from "../../types/Field";

const BelongsTo = ({
    config,
    fieldKey,
    fieldConfig,
    fieldData,
}: FieldInputProps) =>
{
    const primaryKey = fieldConfig.belongsTo && fieldConfig.belongsTo.primaryKey ? fieldConfig.belongsTo.primaryKey: 'id'
    const labelText = fieldConfig.belongsTo && fieldConfig.belongsTo['label'];

    const configForComponent = {...fieldConfig}
    configForComponent.options = {}
    if (!('options' in fieldConfig)) fieldConfig.options = {}
    Object.keys(fieldConfig.options).map((key) => configForComponent.options[fieldConfig.options[key][primaryKey]] = fieldConfig.options[key][labelText])

    const selectedKey = fieldData && Object.keys(fieldConfig.options).find((key) => fieldConfig.options[key][primaryKey] == fieldData[primaryKey])
    const fieldDataForComponent = fieldData && selectedKey && primaryKey in fieldConfig.options[selectedKey] ?
        fieldConfig.options[selectedKey][primaryKey] : null

    // if (!selectedKey) fieldErrors.push('リレーションにない値を選択している可能性があります。')

    return (<div className={`BelongsTo ${fieldKey}`}>
        <SelectRadio
            fieldKey={fieldKey}
            fieldConfig={configForComponent}
            fieldData={fieldDataForComponent}
        />

        {/*!selectedKey && (<span className='error'>※範囲外の値を選択しています。</span>) */}
    </div>)
}

export default BelongsTo