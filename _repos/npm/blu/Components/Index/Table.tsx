
import React, { useState, useEffect } from 'react'
import TableHeaders from './Header/TableHeaders'
import TableData, { usePreferenceFields } from './Body/TableData'

const Table = ({
    config,
    preference,
    data,
    isLoading,
    searchParams,
    setSearchParams,
    customCells = {},
    forceCustomrCells=true,
}) =>
{
    const [cols, setCols ]  = useState([])
    useEffect(() => {

        setCols(Array(Object.keys(usePreferenceFields({
            config,
            preference,
            data: data,
            fields: {},
        })).length).fill(null))
    }, [preference])

    const [rows, setRows ]  = useState([])
    useEffect(() => {
        if (!isLoading)
        {
            const newRows = []
            for (let i = 0; i < data.length; i++)
            {
                newRows.push(<>&nbsp;</>)
            }
            setRows(newRows)
        }
    }, [data])


    if (forceCustomrCells)
    {
        {Object.keys(customCells).map((key) => {
            if (!preference.includes(key))
            {
                if (Object.keys(preference).filter((k) => k == key).length < 1)
                {
                    preference[key] = key
                }
                if (Object.keys(config).filter((k) => k == key).length < 1)
                {
                    config[key] = {
                        label: customCells[key].label,
                    }
                }
            }
        })}
    }

    return (<table>
        <thead>
            <tr>
                <TableHeaders
                    config={config}
                    preference={preference}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </tr>
        </thead>
        <tbody>
        {(isLoading) && (<>
            {rows.map((e, i) => (<tr key={i}>
                {cols.map((tde, tdi) => (<td key={tdi}>&nbsp;</td>))}
            </tr>))}
        </>) || (<>
            {data.map((datum, i) => {
                const fields = {}
                {Object.keys(customCells).map((key) => {
                    fields[key] = React.createElement(
                        customCells[key]['type'],
                        {...{data: datum}, ...customCells[key]['props']},
                        customCells[key]['children']
                    )
                })}

                return (<tr key={i}>
                    <TableData
                        config={config}
                        data={datum}
                        preference={preference}
                        fields={fields}
                    />
                </tr>)
            })}
        </>)
        }
        </tbody>
    </table>)
}

export default Table