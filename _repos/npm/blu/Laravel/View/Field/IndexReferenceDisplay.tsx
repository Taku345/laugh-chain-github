import React from 'react'
import { isObject, toArr } from '../../../classes/util'

/*
 * 参照のテーブル
 */
const IndexReferenceDisplay = ({
    fieldKey,
    config,
    data,
}) =>
{
    const fieldConfig = config[fieldKey]

    const previews: any[] = []
    
    if (fieldConfig.IndexReference?.preview && fieldKey in data && isObject(data[fieldKey]))
    {
        const previewKeys = toArr(fieldConfig.IndexReference.preview)

        previewKeys.map((previewKey) => {
            if (previewKey in data[fieldKey] && data[fieldKey][previewKey])
            {
                previews.push(data[fieldKey][previewKey])
            }
        })
    }

    return (<div className='IndexReferenceDisplay'>
        {previews.length > 0 && (<span className='previews'>
            {previews.map((preview) => (<span className='preview'>{preview}</span>))}
        </span>)}
    </div>)

}

export default IndexReferenceDisplay