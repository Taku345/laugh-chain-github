import { FieldInputProps } from "../../types/Field";

import React from 'react'

const Reference = ({
    fieldKey,
    fieldConfig,
    fieldData,
}: FieldInputProps) =>
{
    if (
        'label' in fieldConfig?.reference &&
        'options' in fieldConfig &&
        fieldData in fieldConfig['options'] &&
        fieldConfig?.reference['label'] in fieldConfig['options'][fieldData]
    )
    {
        fieldData = fieldConfig['options'][fieldData][fieldConfig?.reference['label']]
    }

    return <span
            className={`Reference ${fieldKey} ${fieldConfig.className ?? ''}`}
        >
            {fieldData}
        </span>
}

export default Reference