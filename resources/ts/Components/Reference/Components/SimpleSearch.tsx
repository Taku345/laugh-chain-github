
import { useEffect, useState, useRef } from 'react'
import { useIndex } from 'blu/classes/apis'
import CheckIcon from '@mui/icons-material/Check';
import InputIcon from '@mui/icons-material/Input';

const SimpleSearchPreview = ({rowData, searchKeys}) =>
{
    return <span className="SimpleSearchPreview">
        {searchKeys.map((searchKey) => (
            searchKey in rowData ? <span>{rowData[searchKey]}</span> : <></>
        ))}
    </span>
}

const SimpleSearch = ({
    apiUrl,
    onChoice,
    searchKeys=[],
    searchParamsDefault = { perPage: 5 },
}) =>
{
    const [ simpleSearchParams, setSimpleSearchParams ] = useState(searchParamsDefault)
    const [ serachText, setSearchText ] = useState('')
    const results = useIndex(apiUrl, simpleSearchParams)
    const isFirstRender = useRef(true)

    useEffect(() =>
    {
        if (isFirstRender.current)
        {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() =>
        {
            const newSearchParams = {...searchParamsDefault}
            if (serachText != '')
            {
                searchKeys.map((searchKey) =>
                {
                    newSearchParams[searchKey] = serachText
                })
            }

            setSimpleSearchParams(newSearchParams)
        }, 500)

        return () => clearTimeout(timer)
    }, [serachText, searchParamsDefault])

    return (<div className="SimpleSearch">
        <header>
            <input
                type="text"
                value={serachText}
                placeholder="簡易検索"
                onChange={(e) => setSearchText(e.target.value)}
            />
        </header>
        {serachText && Array.isArray(results.data?.data) && (
        <ul>
            {results.isLoading && (<tr><td rowSpan={5}>loading...</td></tr>) || (results.data?.data.map((rowData) => (<li
                className="" onClick={() => {
                    setSearchText('')
                    onChoice(rowData)
                }}>
                <CheckIcon />
                <SimpleSearchPreview
                    rowData={rowData}
                    searchKeys={searchKeys}
                />
            </li>)))}
        </ul>
        )}
    </div>)
}

export default SimpleSearch