import { createElement, Fragment, createContext, useContext } from 'react'
import Field from './Field'
import PreferenceFields from '../../classes/preferenceFields'
import FieldInput from './FieldInput'
import { isObject } from '../../classes/util';

const ViewContext = createContext({});
export const ViewContextProvider = ({ children, callbacks = {} }) =>
{
    return (
        <ViewContext.Provider
            value={callbacks}
        >
            { children }
        </ViewContext.Provider>
    );
}
export const useViewContext = () => useContext(ViewContext);

export const useFields = ({
    config,
    preference,
    data,
    fields = {}
}) =>
{
    for (const key in config)
    {
        if (fields[key] || (!Object.values(preference).flat().includes('*') && !Object.values(preference).flat().includes(key))) continue

        fields[key] = (<Field
            key={key}
            fieldKey={key}
            config={config}
        >
            <FieldInput
                fieldKey={key}
                config={config}
                preference={preference}
                data={data}
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

    return (<ViewContextProvider
        callbacks={'callbacks' in props && isObject(props.callbacks) ? props.callbacks : {}}
    >
        <div className='View Fields'>
            {Object.keys(preferenceFields).map((key) => (<>{preferenceFields[key]}</>))}
        </div>
    </ViewContextProvider>
    )
}

export default Fields