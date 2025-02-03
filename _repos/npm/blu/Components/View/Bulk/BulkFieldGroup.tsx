import { createElement} from 'react'
import { useField } from '../Field'
import FieldInput from '../FieldInput'

const BulkFieldGroup = (props) =>
{

    const { 
        fieldKey,
        config,
        data,
    } = props

    const field = <FieldInput
        fieldKey={fieldKey}
        config={config}
        data={data}
        preference={[]}
    />

    const { label, tag } = useField(props)

    return createElement(
        tag,
        typeof tag == 'string' ? { className: 'Field' } : {},
        <>
            {tag != 'td' && (label)} { /* tag が table かどうかで出し分ける */ }
            {field}
        </>
    );
}

export default BulkFieldGroup