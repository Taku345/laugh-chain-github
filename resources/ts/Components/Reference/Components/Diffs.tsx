import { ArrGet, isObject, toArr } from 'blu/classes/util'
import isEqual from 'lodash.isequal'
/*
 * マスタと入力値が違うもののリスト
 * masterKey: [ masterValue, dataValue]
 */

type DiffType = {
    dataKey: string,
    masterValue: string,
    dataValue: string,
    masterString: string,
    dataString: string,
}

type DiffList = { [masterKey: string]: DiffType }

const valueToString = ({
    config,
    key,
    value
}) =>
{
    let valueString = value
    // type によって出し分ける
    if (
        'type' in config[key] &&
        ['radio', 'select'].includes(config[key].type) &&
        'options' in config[key] &&
        value in config[key].options
    )
    {
        valueString = config[key].options[value]
    }
    else if (
        isObject(value) // TODO: そもそも比較が Object のため == ではダメ
    )
    {
        const previews = []
        if (config[key]?.IndexReference?.preview)
        {
            const previewKeys = toArr(config[key]?.IndexReference?.preview)
    
            previewKeys.map((previewKey) => {
                if (value[key] && previewKey in value[key] && value[key][previewKey])
                {
                    previews.push(value[key][previewKey])
                }
            })

            valueString = previews.join('')
        }
        else
        {
            valueString = '参照'
        }
    }

    return valueString

}

const getDiffs = ({
    config,
    fieldKey,
    data,
}): DiffList =>
{
    const fieldConfig = config[fieldKey]

    let diffs: DiffList = {}
    if (data[fieldKey] && 'reference' in fieldConfig.IndexReference)
    {
        Object.keys(fieldConfig.IndexReference.reference).filter((masterKey) =>
        {
            const refToKey = fieldConfig.IndexReference.reference[masterKey]
            const _dataValue = refToKey in data && data[refToKey] ? data[refToKey] : null
            const _masterValue = masterKey in data[fieldKey] && data[fieldKey][masterKey] ? data[fieldKey][masterKey] : null
            if (isObject(_masterValue)) console.log('isEqual', refToKey, _dataValue, _masterValue, isEqual(_dataValue, _masterValue) )
            return isObject(_masterValue) ? !isEqual(_dataValue, _masterValue) : _dataValue != _masterValue 
        }).map((masterKey) =>
        {
            const dataKey = fieldConfig.IndexReference.reference[masterKey]
            const masterValue = masterKey in data[fieldKey] && data[fieldKey][masterKey] ? data[fieldKey][masterKey] : null
            const dataValue = dataKey in data && data[dataKey] ? data[dataKey] : null

            diffs[masterKey] = {
                dataKey,
                masterValue,
                dataValue,
                masterString: valueToString({ config, key: masterKey, value: masterValue}),
                dataString: valueToString({ config, key:dataKey, value: dataValue})
            }
        })
    }

    return diffs
}

const Diffs = ({
    config,
    fieldKey,
    data,
}) =>
{
    const diffsList = getDiffs({
        config,
        fieldKey,
        data,
    })

    return (<div className="Diffs">


    </div>)

    // notice hover で
    // list 表示s
    // button
    //
}

export default Diffs

export {
    getDiffs
}