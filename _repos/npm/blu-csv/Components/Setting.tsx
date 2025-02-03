import { useState } from 'react'
import { toast } from 'react-toastify'
import FieldInput from "../../blu/Components/Form/FieldInput"

const requiredSetting = {
    'name' : {
        label: 'Name',
        type: 'text',
        size: 40,
    },
    'encoding' : {
        label: 'Encoding',
        type: 'select',
        options: {
            SJIS: 'SJIS',
            EUCJP: 'EUCJP',
            UTF8: 'UTF8',
        },
    },
    'ignoreHeader' : {
        label: 'ignoreHeader',
        type: 'number',
        size: 6,
    },
    'ignoreFooter' : {
        label: 'ignoreFooter',
        type: 'number',
        size: 6,
    },
    'isNumberColumn' : {
        label: 'Column Display',
        type: 'select',
        options: {
            '': 'Alphabet(A, B...)',
            '1':  'Number(0, 1..)',
        },
    },
}


export const useSetting = ({
    settings,
    setSettings,
    resetSettings = null,
    customSetting = {},
}) => 
{
    const [ setting, setSetting ] = useState({
        name: '',
        encoding: 'SJIS',
        ignoreHeader: 0,
        ignoreFooter: 0,
        searchField: {},
        importFields: [],
        isAlphabetColumn: 1
    })
    const addSetting = () =>
    {
        if (!setting.name)
        {
            toast.error('名前を入力してください');
            return;
        }
        for (let key in settings)
        {
            if (settings[key].name == setting.name)
            {
                toast.error('名前が重複しています');
                return;
            }
        }

        const newSetting = settings.slice();

        newSetting.push(setting)
        setSettings(newSetting)
    }

    const removeSetting = (i) =>
    {
        const newSetting = settings.slice();
        newSetting.splice(i, 1);
        setSettings(newSetting)
    }

    const applySetting = (i) =>
    {
        if (!settings[i]) return;

        const setting = settings[i];
        setSetting(setting)
    }

    const tableComponent = <div className="CsvImporter Setting">
        <h2>Required</h2>
        <dl className="CsvImporter Setting">
            {Object.keys(requiredSetting).map((key => (<>
                <dt>{requiredSetting[key].label}</dt>
                <dd>
                    <FieldInput
                        fieldKey={key}
                        config={requiredSetting}
                        preference={[]}
                        data={setting}
                        setData={setSetting}
                        errors={[]}
                    />
                </dd>
            </>)))}
        </dl>

        <h2>Custom</h2>
        <dl>
            {Object.keys(customSetting).map((key => (<>
                <dt>{customSetting[key].label}</dt>
                <dd>
                    <FieldInput
                        fieldKey={key}
                        config={customSetting}
                        preference={[]}
                        data={setting}
                        setData={setSetting}
                        errors={[]}
                    />
                </dd>
            </>)))}
        </dl>

        <h2>Save</h2>
        <dl>
            <dt>設定に名前をつけて保存</dt>
            <dd>
                <button onClick={addSetting} className="button small">現在の設定を保存</button>
            </dd>

            <dt>保存した設定</dt>
            <dd>
                <table className="seved-settings">
                    <tbody>
                    {settings.map((setting, i) => (
                        <tr>
                            <th>{setting.name}</th>
                            <td><button onClick={() => applySetting(i)} className="button small">LOAD</button></td>
                            <td><button onClick={() => removeSetting(i)} className="button small">DELETE</button></td>
                        </tr>
                    ))}
                    </tbody>
                    {resetSettings && (
                    <tfoot>
                        <td colSpan={3}>
                            <button className="button danger" onClick={resetSettings}>ALL DELETE AND RESET</button>
                        </td>
                    </tfoot>
                    )}
                </table>
            </dd>
        </dl>

        </div>

    return { setting, setSetting, settings, setSettings, tableComponent }
}