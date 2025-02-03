import { createElement, Fragment } from 'react'
import BulkFieldGroup from './BulkFieldGroup'


const Row = ({ // Form の単位
    tag='table',
    config,
    data,
    setData,
    errors,
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
                fieldGroupTag == '' ? {}: { className: 'FieldGroup'},
                <>
                {Object.keys(config).map((key) =>(
                    <BulkFieldGroup
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
        </>
    )
}

export default Row