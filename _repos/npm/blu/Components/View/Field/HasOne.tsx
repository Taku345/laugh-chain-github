import { useState, } from 'react'
import { ReactSortable } from 'react-sortablejs'
import Bulk from '../Bulk'
import Fields from '../Fields'
import { FieldInputProps } from "../../types/Field";

const HasOne = ({
    fieldKey,
    fieldConfig,
    fieldData, // array
}: FieldInputProps) =>
{
    return (<div className={`HasOne FieldGroup FieldGroup-${fieldKey}`}>
        <Fields
            config={fieldConfig['hasOne']['config']}
            data={fieldData}
            preference={['*']}
        />
    </div>)
}

export default HasOne