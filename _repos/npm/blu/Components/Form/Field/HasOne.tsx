import Fields from '../Fields'
import { FieldInputFormProps } from '../../types/Field'

const HasOne = ({
    name,
    fieldKey,
    fieldConfig,
    data,
    fieldData, // array
    fieldErrors, // array だが、
    setFieldData,
}: FieldInputFormProps) =>
{
    const setHasOneData = (newValue) =>
    {
        const newData = {...data}
        newData[fieldKey] = newValue
        setFieldData(data)
    }

    return (<div className={`HasOne FieldGroup FieldGroup-${fieldKey}`}>
        <Fields
            namePrefix={name + '.'}
            config={fieldConfig['hasOne']['config']}
            data={fieldData}
            setData={setFieldData}
            preference={['*']}
            errors={fieldErrors}
        />
    </div>)
}

export default HasOne