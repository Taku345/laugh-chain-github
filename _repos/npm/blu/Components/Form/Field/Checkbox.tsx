import { FieldInputFormProps } from '../../types/Field'
/*
振る舞いについて注意
特に value の扱いが他とは異なるので
*/


const Checkbox = ({
    name,
    fieldConfig,
    fieldData,
    setFieldData,
}: FieldInputFormProps) =>
{
    const handleCheckboxesChange = (e, key, index) =>
	{
		const newChecked = fieldData ? fieldData.slice(): [];

		if (e.target.checked)
		{
			if (newChecked.findIndex(element => element == key) == -1) newChecked.push(key)
		}
		else
		{
			if (newChecked.findIndex(element => element == key) > -1) newChecked.splice(fieldData.findIndex(element => element == key), 1);
		}

        if (newChecked.length > 0)
        {
		    setFieldData(newChecked);
        }
        else
        {
		    setFieldData(newChecked);
        }
	}


                    //name={Object.keys(fieldConfig.options).length > 1 ? `${name}[]`: name}
    // TODO: newChecked を配列の index で指定すると配列の length がくるうので、name は空配列[]
    return (<div className="Checkbox">
        {/* TODO: 数字と空文字が共存した際に空文字が先頭にくるように sort radio と select のみでcheckbox はいらない? */}
        {Object.keys(fieldConfig.options).map((key, index) => (
            <label key={key}>
                <input
                    name={`${name}[]`}
                    type="checkbox"
                    checked={Object.keys(fieldConfig.options).length > 1 ?
                        Boolean(fieldData && fieldData.findIndex(element => element == key) > -1):
                        Boolean( fieldData )
                    }
                    value={key}
                    onChange={Object.keys(fieldConfig.options).length > 1 ?
                        (e) => handleCheckboxesChange(e, key, index) :
                        (e) => setFieldData(e.target.checked ? (key ?? 1): false)
                    }
                />
                {fieldConfig.options[key]}
            </label>
        ))}
    </div>)
}



export default Checkbox