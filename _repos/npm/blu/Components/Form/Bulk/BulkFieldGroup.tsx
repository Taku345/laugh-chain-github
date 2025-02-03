import { createElement} from 'react'
import { useField } from '../Field'
import FieldInput from '../FieldInput'

const BulkFieldGroup = (props) =>
{
    const { 
        namePrefix,
        fieldKey,
        config,
        data,
        setData,
    } = props

    const field = <FieldInput
        namePrefix={namePrefix}
        fieldKey={fieldKey}
        config={config}
        data={data}
        setData={setData}
        errors={props.errors}
        preference={[]}
    />

    const { label, fieldConfig, errors, tag, before, after, description } = useField(props)

    return createElement(
        tag,
        typeof tag == 'string' ? { className: `Field ${fieldKey} ${fieldConfig.className ?? ''} ` } : {},
        <>
            {tag != 'td' && (label)} { /* tag が table かどうかで出し分ける */ }
            {before}
            {field}
            {after}
            {errors}
            {description}
        </>
    );
}

export default BulkFieldGroup