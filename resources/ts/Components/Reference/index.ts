import { ArrGet, isObject, toArr } from 'blu/classes/util'
import isEqual from 'lodash.isequal'

// マスターデータとの差異を見る
const diffs = ({
    config,
    data, 
    fieldKey,
}) =>
{
    const fieldConfig = config[fieldKey]

    return data[fieldKey] && 'reference' in fieldConfig.IndexReference && Object.keys(fieldConfig.IndexReference.reference).filter((masterKey) =>
    {
        const refToKey = fieldConfig.IndexReference.reference[masterKey]
        const _dataValue = refToKey in data && data[refToKey] ? data[refToKey] : null
        const _masterValue = masterKey in data[fieldKey] && data[fieldKey][masterKey] ? data[fieldKey][masterKey] : null
        if (isObject(_masterValue)) console.log('isEqual', refToKey, _dataValue, _masterValue, isEqual(_dataValue, _masterValue) )
        return isObject(_masterValue) ? !isEqual(_dataValue, _masterValue) : _dataValue != _masterValue 
    }).map((masterKey) => {
        const _masterValue = masterKey in data[fieldKey] && data[fieldKey][masterKey] ? data[fieldKey][masterKey] : ' '
        const refToKey = fieldConfig.IndexReference.reference[masterKey]

        let masterValuePreview = _masterValue
        // type によって出し分ける
        if (
            'type' in fieldConfig &&
            ['radio', 'select'].includes(fieldConfig.type) &&
            'options' in fieldConfig &&
            _masterValue in fieldConfig.options
        )
        {
            masterValuePreview = fieldConfig.options[_masterValue]
        }
        else if (
            isObject(_masterValue) // TODO: そもそも比較が Object のため == ではダメ
        )
        {
            const previews = []
            if (config[refToKey]?.IndexReference?.preview)
            {
                console.log('refToKey', masterKey, _masterValue, _masterValue[masterKey])
                const previewKeys = toArr(config[refToKey]?.IndexReference?.preview)
        
                previewKeys.map((previewKey) => {
                    if (_masterValue[masterKey] && previewKey in _masterValue[masterKey] && _masterValue[masterKey][previewKey])
                    {
                        previews.push(_masterValue[masterKey][previewKey])
                    }
                })

                masterValuePreview = previews.join('')
            }
            else
            {
                masterValuePreview = '参照'
            }
        }
    })
}

// 現状の入力が存在しているか見る
const exestInput = ({
    config,
    editingData,
    fieldConfig,
}) =>
{
    return 'reference' in fieldConfig.IndexReference && Object.keys(fieldConfig.IndexReference.reference).filter((key) => {
        return Boolean(editingData[fieldConfig.IndexReference.reference[key]]) &&
            fieldConfig.IndexReference.reference[key] in config &&
            config[fieldConfig.IndexReference.reference[key]].type &&
            config[fieldConfig.IndexReference.reference[key]].type != 'hidden'
    }).length
}

export {
    diffs, exestInput
}