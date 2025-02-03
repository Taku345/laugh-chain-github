import PreferenceFields from '../../../classes/preferenceFields'
import FieldInput from "../../../Components/View/FieldInput"
import { isObject, isString } from '../../../classes/util'
import { createContext, useContext } from 'react';

export const useFields = ({
    config,
    data,
    preference,
    fields = {},
}) =>
{
    for (const key in config)
    {
        if (fields[key] || (!Object.values(preference).flat().includes('*') && !Object.values(preference).flat().includes(key))) continue

        fields[key] = (<FieldInput
            key={key}
            fieldKey={key}
            config={config}
            preference={preference}
            data={data}
        />)
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

const TableData = (props) =>
{

    const {
        config,
        preference,
        data,
        fields = {},
    } = props

    const preferenceFields = usePreferenceFields({
        config,
        preference,
        data: data,
        fields,
    })


    return (<>
    {Object.keys(preferenceFields).map((key) => (
        <td className={`${isString( key ) ? 'th-'+key : ''} ${key in preference ? Array.isArray(preference[key]) ? preference[key].join(' ') : preference[key]: ''}`} key={key}>{preferenceFields[key]}</td>
    ))}
    </>)
}

export default TableData