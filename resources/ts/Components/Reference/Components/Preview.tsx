
import { ArrGet, isObject, toArr } from 'blu/classes/util'

const previewsByKeys = (
    previewKeys,
    fieldData,
) =>
{
    const previews = []
    if (previewKeys && isObject(fieldData))
    {
        previewKeys = toArr( previewKeys )
        previewKeys.map((previewKey) => {
            if (previewKey in fieldData && fieldData[previewKey])
            {
                previews.push(fieldData[previewKey])
            }
        })
    }
    return previews
}

const Preview = ({
    config,
    fieldKey,
    data,
}) =>
{
    const fieldConfig = config[fieldKey]
    const previews = previewsByKeys(fieldConfig.IndexReference?.preview, data[fieldKey])

    return <div className="Preview">
        {previews.length > 0 && (<>
            {previews.map((preview, i) => (<span className='preview' key={i}>{preview}</span>))}
        </>)}
    </div>
}

export default Preview
export {
    previewsByKeys
}