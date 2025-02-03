import { createElement, Fragment } from 'react'

const usePreferenceFields = ({
    config,
    preference,
    fields,
    fieldGroupTag = 'div'
}) =>
{
    const preferenceFields = {}

    if (preference)
    {
        Object.keys(preference).map((key) =>
        {
            if (Array.isArray(preference[key]))
            {
                preferenceFields[key] = createElement(
                    fieldGroupTag,
                    {
                        key: key,
                        className: typeof fieldGroupTag == 'string' ? `FieldGroup FieldGroup-${key} ${preference[key].join(' ')}` : '',
                    },
                    <>
                        {preference[key].map((fieldKey) => <Fragment key={fieldKey}>{fields[fieldKey]}</Fragment>)}
                    </>
                );
            }
            else
            {
                if (preference[key] == '*')
                {
                    const wildCardFields = {}
                    Object.keys(config).map((configKey) => {

                        // すでにレンダーされているか、レンダー予定か
                        if (configKey == '*' ||  Object.values(preference).flat().findIndex((pref) => pref == configKey) > -1)
                        {
                            return
                        }
                        wildCardFields[configKey] = fields[configKey]
                    })
                    preferenceFields['*'] = (<Fragment key={key}>{Object.keys(wildCardFields).map((wk) => wildCardFields[wk])}</Fragment>)
                }
                else
                {
                    preferenceFields[key] = fields[preference[key]]
                }
            }
        })
    }
    else
    {
        {Object.keys(fields).map((key) => {
            preferenceFields[key] = fields[key]
        })}
    }

    return preferenceFields
}

export default usePreferenceFields;