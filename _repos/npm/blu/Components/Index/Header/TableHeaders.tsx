import { isString, stringBytes } from '../../../classes/util'
import PreferenceFields from '../../../classes/preferenceFields'
import SortButton from './SortButton'

export const useFields = ({
    config,
    searchParams,
    setSearchParams,
    fields = {},
}) =>
{

    for (const key in config)
    {
        if (fields[key]) continue

        fields[key] = (<TableHeaderLabel
            fieldKey={key}
            fieldConfig={config[key]}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
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



const TableHeaderLabel = ({ fieldKey, fieldConfig, searchParams, setSearchParams }) =>
{
    const label = fieldConfig.label ?? fieldKey
    return (<div className={`TableHeaderLabel ${fieldKey}`}>
        <span className={`label ${fieldConfig.required && 'required'}`} style={{ minWidth: (stringBytes(label)/2) + 'em' }}>{label}</span>
        {('sort' in fieldConfig && searchParams && setSearchParams) && (<SortButton
            orderBy={fieldKey}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            children={null}
        />)}
    </div>)
}


const TableHeaders = (props) =>
{
    const preferenceFields = usePreferenceFields(props)

    return (<>
        {Object.keys(preferenceFields).map((key) => (
            <th
                className={`${isString( key ) ? 'th-'+key : ''} ${key in props.preference ? Array.isArray(props.preference[key]) ? props.preference[key].join(' ') : props.preference[key]: ''}`}
                key={key}
            >
                {preferenceFields[key]}
            </th>
        ))}
    </>)
}

export default TableHeaders