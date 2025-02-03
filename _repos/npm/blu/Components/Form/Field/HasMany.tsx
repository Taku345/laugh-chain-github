import { useState, } from 'react'
import { ReactSortable } from 'react-sortablejs'
import Bulk from '../Bulk'
import { FieldInputFormProps } from '../../types/Field'

const HasMany = ({
    name,
    fieldConfig,
    fieldData, // array
    fieldErrors, // array だが、
    setFieldData,
}: FieldInputFormProps) =>
{
    // ほぼほぼ bulk だが、 bulk との違いは、入力の結果が全体のデータに影響しうる。
    // 例えば、計算の合計など。
    // 逆に bulk は、上位のデータに対して影響しない、かつ見ない設計にする。

    // table 以外のレンダー方法も ul や grid など

    fieldConfig.hasMany.config

    return (<div className={`HasMany`}>
        <Bulk
            name={name}
            tag={fieldConfig.hasMany.tag ?? 'table'}
            config={fieldConfig.hasMany.config}
            bulkData={fieldData}
            setBulkData={setFieldData}
            bulkErrors={fieldErrors}
            addButtonText={'addButtonText' in fieldConfig ? fieldConfig.addButtonText:'新規列を追加'}
        />
    </div>)
}

export default HasMany