import PreferenceFields from '../../../classes/preferenceFields'
import FieldInputView from "../../View/FieldInput"
import FieldInputForm from "../../Form/FieldInput"
import Field, { useField } from '../../Form/Field'
import { FormContextProvider } from '../..//Form/Fields'
import { isObject } from '../../../classes/util'

export const useFields = ({
    config,
    data,
    setData,
    errors,
    preference = {},
    fields = {},
}) =>
{
    for (const key in config)
    {
        if (fields[key]) continue

        fields[key] = (<Field
            fieldKey={key}
            config={config}
            errors={errors}
        >
            <FieldInputForm
                key={key}
                fieldKey={key}
                config={config}
                data={data}
                setData={setData}
                preference={preference}
                errors={errors}
            />
        </Field>)
    }

    return fields
}


export const usePreferenceFields = (props) =>
{
    const { config, preference, fieldGroupTag } = props
    const fields = useFields(props)
    const preferenceFields = PreferenceFields({
        config,
        preference,
        fields,
        fieldGroupTag
    })

    return preferenceFields
}

const InlineForm = (props) =>
{
    const {
        config,
        preference,
        data,
        setEditData,
        errors,
        fields = {},
    } = props

    const preferenceFields = usePreferenceFields({
        config,
        preference,
        data: data,
        setData,
        errors,
        fields: fields,
    })

    return (<FormContextProvider
        callbacks={'callbacks' in props && isObject(props.callbacks) ? props.callbacks : {}}
    >
        {Object.keys(preferenceFields).map((key) => (<td className={`InlineForm key`} key={key}>{preferenceFields[key]}</td>))}
    </FormContextProvider>)
}

export default InlineForm