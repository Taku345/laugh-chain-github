import { Fragment } from 'react'
import { FieldInputProps } from "../../types/Field";


/*
振る舞いについて注意
特に value の扱いが他とは異なるので
*/

const Checkbox = ({
    fieldKey,
    fieldConfig,
    fieldData,
}: FieldInputProps) =>
{
    return (<div className={`Checkbox ${fieldKey}`}>
        {Object.keys(fieldConfig.options).map((key) => (<Fragment key={key}>
            {(Object.keys(fieldConfig.options).length > 1 ?
                Boolean(fieldData && fieldData.findIndex(element => element == key) > -1):
                Boolean( fieldData )
            ) && (<span className="Raw">{fieldConfig.options[key]}</span>) || (<></>)}
        </Fragment>))}
    </div>)
}



export default Checkbox