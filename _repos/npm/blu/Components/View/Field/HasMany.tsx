import Bulk from '../Bulk'
import { FieldInputProps } from "../../types/Field";


const HasMany = ({
    fieldConfig,
    fieldData, // array
}: FieldInputProps) =>
{
    // ほぼほぼ bulk だが、 bulk との違いは、入力の結果が全体のデータに影響しうる。
    // 例えば、計算の合計など。
    // 逆に bulk は、上位のデータに対して影響しない、かつ見ない設計にする。

    // table 以外のレンダー方法も ul や grid など

    fieldConfig.hasMany.config

    return <Bulk
        tag={fieldConfig.hasMany.tag ?? 'table'}
        config={fieldConfig.hasMany.config}
        bulkData={fieldData}
    />
}

export default HasMany