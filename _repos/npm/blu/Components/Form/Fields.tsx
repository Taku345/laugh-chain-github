import { createElement, Fragment, createContext, useContext } from 'react'
import Field from './Field'
import FieldInput from './FieldInput'
import PreferenceFields from '../../classes/preferenceFields'
import { isObject } from '../../classes/util';

import { FieldFormProps } from '../types/Field';

const FormContext = createContext({});
export const FormContextProvider = ({ children, callbacks = {} }) =>
{
    return (
        <FormContext.Provider
            value={callbacks}
        >
            { children }
        </FormContext.Provider>
    );
}
export const useFormContext = () => useContext(FormContext);



export const useFields = ({
    config,
    preference,
    data,
    setData,
    errors,
    fields={},
    namePrefix='',
}: FieldFormProps) =>
{
    for (const key in config)
    {
        if (fields[key] || (!Object.values(preference).flat().toString().includes('*') && !Object.values(preference).flat().toString().includes(key))) continue

        fields[key] = (<Field
            fieldKey={key}
            config={config}
            errors={errors}
        >
            <FieldInput
                fieldKey={key}
                config={config}
                preference={preference}
                data={data}
                setData={setData}
                errors={errors}
                namePrefix={namePrefix}
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

const Fields = (props) => 
{
    const preferenceFields = usePreferenceFields(props)
    return (<FormContextProvider
        callbacks={'callbacks' in props && isObject(props.callbacks) ? props.callbacks : {}}
    >
        <div className='Form Fields'>
            {Object.keys(preferenceFields).map((key) => (<Fragment key={key}>{preferenceFields[key]}</Fragment>))}
        </div>
    </FormContextProvider>)
}


export default Fields