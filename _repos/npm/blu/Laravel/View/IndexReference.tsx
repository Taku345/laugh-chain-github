import React from 'react'
import Field from '../../Components/View/Field'
import IndexReferenceDisplay from './Field/IndexReferenceDisplay';

const IndexReference = ({
    fieldKey,
    config,
    data,
}) =>
{
    return <Field
        fieldKey={fieldKey}
        config={config}
    >
        <IndexReferenceDisplay
            fieldKey={fieldKey}
            config={config}
            data={data}
        />
    </Field>
}

export default IndexReference