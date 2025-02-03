import { createElement, Fragment } from 'react'
import Row from './Row'

const Body = ({
    tag = 'table',
    config,
    bulkData,
}) =>
{
    const rows = <>
        {bulkData.map((rowData, index) =>(<Row
            key={index}
            tag={tag}
            index={index}
            config={config}
            data={rowData}
        />))}
    </>

    return createElement(
        tag == 'table' ? 'tbody' : tag,
        {
            tag: tag == 'table' ? 'tbody' : tag,
        },
        rows
    )
}

export default Body