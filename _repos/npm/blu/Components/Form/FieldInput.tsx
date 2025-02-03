import Input from './Field/Input'
import Textarea from './Field/Textarea'
import Order from './Field/Order'
import Radio from './Field/Radio'
import Select from './Field/Select'
import Checkbox from './Field/Checkbox'
import Reference from './Field/Reference'
import BelongsTo from './Field/BelongsTo'
import BelongsToMany from './Field/BelongsToMany'
import HasOne from './Field/HasOne'
import HasMany from './Field/HasMany'
import ManyManyPivot from './Field/ManyManyPivot'
import Raw from './Field/Raw'
import { dotNameToFieldName } from '../../classes/util'
import { useFormContext } from './Fields'
/*
relation や type を見て、応じた形式のフィールドを返す
*/

import { FieldInputFormProps } from '../types/Field'

export const createFieldInputFormProps = ({
    fieldKey,
    config,
    preference,
    data,
    setData,
    errors,
    namePrefix = '',
}): FieldInputFormProps =>
{
    const fieldConfig = config[fieldKey];
    return {
        config: config,
        preference: preference,
        data: data,
        setData: setData,
        errors: errors,
        fieldKey: fieldKey,
        fieldConfig: fieldConfig,
        fieldData: data && fieldKey in data ? data[fieldKey]: undefined,
        setFieldData: (value) => { // TODO: callback 方式は使えない?
            const newData = {...data}
            if (value != null)
            {
                newData[fieldKey] = value
            }
            else
            {
                delete newData[fieldKey]
            }

            setData(newData)
        },
        fieldErrors: errors && fieldKey in errors ? errors[fieldKey]: [],
        name: dotNameToFieldName(namePrefix + fieldKey),
    }

}

const FieldInput = ({
    fieldKey,
    config,
    preference,
    data,
    setData,
    errors,
    namePrefix = '',
}) =>
{
    const fieldConfig = config[fieldKey];

    if (!fieldConfig.type || fieldConfig.type == 'false')
    {
        return <></>
    }


    const props = createFieldInputFormProps({
        fieldKey,
        config,
        preference,
        data,
        setData,
        errors,
        namePrefix: namePrefix,
    })

    const callbacks = useFormContext();

    if (fieldConfig.type in callbacks)
    {
        return callbacks[fieldConfig.type](props)
    }
    else if (fieldKey in callbacks)
    {
        return callbacks[fieldKey](props)
    }

    // relation かどうか
    switch (fieldConfig.type)
    {
    case 'raw':
        return <Raw {...props} />
    case 'order':
        return <Order {...props} />
    case 'textarea':
        return <Textarea {...props} />
    case 'radio':
        return <Radio {...props} />
    case 'select':
        return <Select {...props} />
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
    // case 'manyManyPivot':
    //    return <ManyManyPivot {...props} />
    default:
        return <Input {...props} />
    }

    // template を適用
}

export default FieldInput