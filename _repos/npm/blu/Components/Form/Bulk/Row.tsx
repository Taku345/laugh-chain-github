import { createElement, Fragment } from 'react'
import BulkFieldGroup from './BulkFieldGroup'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';


const Row = ({ // Form の単位
    namePrefix,
    tag='table',
    index,
    config,
    data,
    setData,
    errors,
    removeRow,
}) =>
{
    const tags = {
        rowTag: 'div',
        fieldGroupTag: 'div',
        fieldTag: 'div',
    }
    switch (tag)
    {
    case 'table':
        tags.rowTag = 'tr'
        tags.fieldGroupTag = ''
        tags.fieldTag = 'td'
        break
    case 'ul':
        tags.rowTag = 'li'
        break
    }

    const { rowTag, fieldGroupTag, fieldTag } = tags

    return createElement(
        rowTag,
        {
            className: 'Row',
        },
        <>
            {createElement(
                fieldGroupTag == '' ? Fragment: fieldGroupTag,
                fieldGroupTag == '' ? {} : {
                    className: 'FieldGroup',
                },
                <>
                {Object.keys(config).map((key) =>(
                    <BulkFieldGroup
                        namePrefix={namePrefix}
                        key={key}
                        tag={fieldTag}
                        fieldKey={key}
                        config={config}
                        defaultData={{}}
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                ))}
                </>
            )}
            {createElement(
                fieldTag ?? 'span',
                {
                    className: 'control',
                },
                <div className='button-group'>
                    {(Object.keys(config).filter((confKey) => config[confKey].type == 'order').length > 0) && (
                        <span className="button small green sort"><UnfoldMoreIcon className='icon' /></span>
                    )}
                    {removeRow && (
                        <button className='button small delete' onClick={removeRow}><ClearIcon className='icon' /></button>
                    )}
                </div>
            )}
        </>
    )
}

export default Row