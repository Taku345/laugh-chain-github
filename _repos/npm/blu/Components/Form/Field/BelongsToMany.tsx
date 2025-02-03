import { FieldInputFormProps } from '../../types/Field'

const BelongsToMany = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{
    // TODO: fieldDefaultData
    // TODO: checkbox 以外も reference

    // TODO: checkbox と同様の理由で、name は空配列([])

    const primaryKey = fieldConfig.belongsToMany['primaryKey'];

    return (<div className="Checkbox">
    {Object.keys(fieldConfig.options).map((key) => (
        <label key={key}>
            <input
                name={`${name}[]`}
                type="checkbox"
                checked={ 
                    Boolean(
                        fieldData &&
                        Array.isArray(fieldData) &&
                        fieldData.findIndex(element => element[primaryKey] == fieldConfig.options[key][primaryKey]) > -1
                    )
                }
                value={fieldConfig.options[key][primaryKey]}
                onChange={(e) => {
		            const newFieldData = Array.isArray(fieldData) ? fieldData.slice(): []
                    const findIndex = newFieldData.findIndex(element => element[primaryKey] == fieldConfig.options[key][primaryKey])
                    if (e.target.checked)
                    {
			            if (findIndex == -1) newFieldData.push(fieldConfig.options[key]);
                    }
                    else
                    {
			            if (findIndex > -1) newFieldData.splice(findIndex, 1);
                    }
		            setFieldData(newFieldData);
                }}
            />
            {fieldConfig.options[key][fieldConfig.belongsToMany['label']]}
        </label>
        ))}
    </div>)
}

export default BelongsToMany