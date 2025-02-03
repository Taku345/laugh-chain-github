import { createElement, Fragment } from 'react'
import FieldInput from './FieldInput'

export const useField = (props) =>
{
    const {
        fieldKey,
        config,
        tag = 'div'
    } = props
    const fieldConfig = config[fieldKey]

    if (fieldConfig.type == 'hidden')
    {
        return {
            label: <></>,
            field: <></>,
            tag: Fragment,
        }
    }

    return {
        label: <label className='FieldLabel'>
                {fieldConfig.label ?? fieldKey}
                {fieldConfig.required && (<span className='Required'>*</span>)}
            </label>,
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
    const { label, tag, fieldConfig, before, after, description } = useField(props)

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
        </>
    );

}

export default Field