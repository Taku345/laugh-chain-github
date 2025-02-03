import { createElement} from 'react'
import { ReactSortable } from 'react-sortablejs'
import Row from './Row'

const Body = ({
    name,
    tag = 'table',
    config,
    removeRow,
    bulkData,
    setBulkData,
    bulkErrors,
    sortKeys,
    sortCallBack,
    setBulkRowData,
}) =>
{

    const rows = <>
        {bulkData.map((rowData, index) =>(<Row
            namePrefix={`${name}.${index}.`}
            key={index}
            tag={tag}
            index={index}
            config={config}
            data={rowData}
            setData={(newRowData) => setBulkRowData(index, newRowData)}
            errors={bulkErrors[index] ?? []}
            removeRow={removeRow ? () => removeRow(index) : null}
        />))}
    </>

    return createElement(
        ReactSortable,
        {
            tag: tag == 'table' ? 'tbody' : tag,
            list: bulkData,
            setList: sortCallBack,
            animation: 200,
            handle: '.sort',
            className: 'Body'
        },
        rows
    )
}

export default Body