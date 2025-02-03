import { createElement, Fragment } from 'react'
import FieldInput from './FieldInput'
import FieldError from './FieldError'

export const useField = (props) =>
{
    const {
        fieldKey,
        config,
        errors,
        tag = 'div'
    } = props
    const fieldConfig = config[fieldKey]
    const fieldErrors = errors && fieldKey in errors ? errors[fieldKey]: []

    try
    {
        if (!fieldConfig.type || fieldConfig.type == 'false' || fieldConfig.type == 'hidden')
        {
            return {
                label: <></>,
                errors: <></>,
                tag: Fragment,
            }
        }
    }catch (e)
    {
        console.log(fieldKey)
        throw e
    }

    return {
        label: <label className={`FieldLabel ${'required' in fieldConfig && fieldConfig.required ? 'required': ''}`}>
                {fieldConfig.label ?? fieldKey}
            </label>,
        errors: <FieldError fieldErrors={fieldErrors} />,
        tag: tag,
        fieldConfig: fieldConfig,
        before: 'before' in fieldConfig && <span className='Before'>{fieldConfig.before}</span> || (<></>),
        after: 'after' in fieldConfig && <span className='After'>{fieldConfig.after}</span> || (<></>),
        description: 'description' in fieldConfig && <div className='Description'>{fieldConfig.description}</div> || (<></>),
    }
}

const Field = (props) => 
{
    const { fieldKey, children } = props
    const { label, errors, tag, fieldConfig, before, after, description } = useField(props)

    return createElement(
        tag,
        typeof tag == 'string' ? { className: `Field ${fieldKey} ${fieldConfig.className ?? ''}` } : {},
        <>
            {label}
            <div className='FieldInput'>
                {before}
                {children}
                {after}
            </div>
            {description}
            {errors}
        </>
    );

}

export default Field