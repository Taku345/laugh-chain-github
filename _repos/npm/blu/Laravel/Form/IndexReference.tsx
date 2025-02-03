import React from 'react'
import Field from '../../Components/Form/Field'
import IndexReferenceInput from './Field/IndexReferenceInput';

const IndexReference = ({
    fieldKey,
    config,
    data,
    setData,
    errors,

    apiUrl,
    indexConfig,
    indexPreference,
    searchPreference,
}) =>
{
    return <Field
        fieldKey={fieldKey}
        config={config}
        errors={errors}
    >
        <IndexReferenceInput
            fieldKey={fieldKey}
            config={config}
            data={data}
            setData={setData}
            apiUrl={apiUrl}
            indexConfig={indexConfig}
            indexPreference={indexPreference}
            searchPreference={searchPreference}
        />
    </Field>
}

export default IndexReference