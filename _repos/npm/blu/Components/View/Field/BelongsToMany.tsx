import { FieldInputProps } from "../../types/Field";

const BelongsToMany = ({
    fieldKey,
    fieldConfig,
    fieldData,
}: FieldInputProps) =>
{
    // TODO: fieldDefaultData
    // TODO: checkbox 以外も reference

    const primaryKey = fieldConfig.belongsToMany['primaryKey'];

    return (<div className={`Checkbox BelongsToMany ${fieldKey}`}>

        {Object.keys(fieldConfig.options).map((key) => (<>
            {(Boolean(
                        fieldData &&
                        Array.isArray(fieldData) &&
                        fieldData.findIndex(element => element[primaryKey] == fieldConfig.options[key][primaryKey]) > -1
                    )
            ) && (<span className="Raw">{fieldConfig.options[key][fieldConfig.belongsToMany['label']]}</span>) || (<></>)}
        </>))}
    </div>)
}

export default BelongsToMany