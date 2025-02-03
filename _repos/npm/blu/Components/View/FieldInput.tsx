import SelectRadio from './Field/SelectRadio'
import Checkbox from './Field/Checkbox'
import BelongsTo from './Field/BelongsTo'
import BelongsToMany from './Field/BelongsToMany'
/*
import ManyManyPivot from './Field/ManyManyPivot'
*/
import Raw from './Field/Raw'
import HasOne from './Field/HasOne'
import HasMany from './Field/HasMany'
import Reference from './Field/Reference'


import { FieldInputProps } from '../types/Field'
import { useViewContext } from './Fields'
/*
relation や type を見て、応じた形式のフィールドを返す
*/
const FieldInput = ({
    fieldKey,
    config,
    preference,
    data,
}) =>
{
    const fieldConfig = config[fieldKey];


    if (fieldConfig.type == 'hidden')
    {
        return <></>
    }

    const props: FieldInputProps = {
        config: config,
        preference: preference,
        data: data,
        fieldKey: fieldKey,
        fieldConfig: fieldConfig,
        fieldData: data && fieldKey in data ? data[fieldKey]: undefined,
    }

    // view 表示では attribute があれば、問答無用でそれを出す
    if ( 'attribute' in fieldConfig && fieldConfig['attribute'] in data )
    {
        // fieldConfig.type = 'raw' //  参照代入になるのでやってはいけない
        return <Raw {...props} />
    }

    const callbacks = useViewContext();
    if (fieldConfig.type in callbacks)
    {
        return callbacks[fieldConfig.type](props)
    }
    else if (fieldKey in callbacks)
    {
        return callbacks[fieldKey](props)
    }


    switch (fieldConfig.type)
    {
    case 'raw':
    case 'order':
    case 'textarea':
        return <Raw {...props} />
    case 'radio':
    case 'select':
        return <SelectRadio {...props} />
    case 'checkbox':
        return <Checkbox {...props} />
    case 'reference':
        return <Reference {...props} />
    case 'belongsTo':
        return <BelongsTo {...props} />
    case 'belongsToMany':
        return <BelongsToMany {...props} />
    case 'hasOne':
        return <HasOne {...props} />
    case 'hasMany':
        return <HasMany {...props} />
        /*
    case 'manyManyPivot':
        return <ManyManyPivot {...props} />
        */
    default:
        return <Raw {...props} />
    }
    // template を適用
}

export default FieldInput