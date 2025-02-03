import React from 'react'
import Field from '../../Components/View/Field'
import IndexReferenceDisplay from '../View/Field/IndexReferenceDisplay';

const IndexReference = ({
    fieldKey,
    config,
    data,
}) =>
{
    return (<IndexReferenceDisplay
        fieldKey={fieldKey}
        config={config}
        data={data}
    />)
}

export default IndexReference