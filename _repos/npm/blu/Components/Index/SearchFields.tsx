import { useState, useEffect, useRef, Fragment } from 'react';
import Field from '../Form/Field';
import FieldInput from '../Form/FieldInput';
import PreferenceFields from '../../classes/preferenceFields'

type SearchFieldsProps = {
    config: any,
    searchConfig: any,
    preference: [],
    data: any,
    setData: (a: any) => void,
    timeout?: number,
    paginationReset?: string,
    fieldGroupTag?: string,
}

export const useSearchFields = ({
    searchConfig,
    preference,
    data,
    setData,
    timeout = 500,
    paginationReset = 'page',
}: SearchFieldsProps) =>
{
    const isFirstRender = useRef(true)

    const fields = {}

    let timer = null

	const [ searchValues, setSearchValues ] = useState((() =>
    {
        const defaultData = {}
        for (const key in searchConfig)
        {
            if (key in data)
            {
                defaultData[key] = data[key]
            }
        }
        return defaultData
    }));

	useEffect(() =>
    {
        if (isFirstRender.current)
        {
            isFirstRender.current = false;
            return;
        }

        // TODO: pagenation reset? ?
		const timer = setTimeout(() =>
        {
            const newData = {...data}
            Object.keys(searchValues).map((key) => {
                if (searchValues[key])
                {
                    newData[key] = searchValues[key]
                }
                else if (key in newData)
                {
                    delete newData[key]
                }
            })

            if (paginationReset && paginationReset in newData)
            {
                delete newData[paginationReset]
            }

            setData(newData)
		}, timeout)

		return () => clearTimeout(timer)
	}, [searchValues]);

    const reset = () =>
    {
        setSearchValues({})
        setData({})
    }

    for (const key in searchConfig)
    {
        fields[key] = (<Field
            fieldKey={key}
            config={searchConfig}
            errors={[]}
        >
            <FieldInput
                fieldKey={key}
                config={searchConfig}
                preference={preference}
                data={searchValues}
                setData={setSearchValues}
                errors={[]}
            />
        </Field>)
    }

    fields['_reset'] = <div className='FieldGroup FieldGroup-SearchControl'>
        <div className='Field _Reset'>
            <button className='button' onClick={reset}>リセット</button>
        </div>
    </div>

    return fields
}

export const usePreferenceSearchFields = (props: SearchFieldsProps) =>
{
    const { searchConfig, preference, fieldGroupTag } = props
    const fields = useSearchFields(props)
    const preferenceFields = PreferenceFields({
        config: searchConfig,
        preference,
        fields,
        fieldGroupTag
    })

    preferenceFields['_reset'] = fields['_reset']

    return preferenceFields
}

const SearchFields = (props: SearchFieldsProps) => 
{
    const { config, preference, setData } = props

    const searchConfig = []
    Object.keys(config).map((key) => {
        if ('search' in config[key])
        {
            Object.keys(config[key]['search']).map((skey) => {
                searchConfig[skey] = config[key]['search'][skey]
            })
        }
    })

    const preferenceFields = usePreferenceSearchFields({ searchConfig, ...props })


    return (<div className='Form Fields SearchFields'>
        {Object.keys(preferenceFields).map((key) => (<Fragment key={key}>{preferenceFields[key]}</Fragment>))}
    </div>)
}

export default SearchFields