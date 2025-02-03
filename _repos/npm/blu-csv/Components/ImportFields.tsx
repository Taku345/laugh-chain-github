import { useState } from 'react';
import { numToAlphabetColumn } from './util'

export const ImportFieldDefault = {
        from: 0,
        to: '',
        replace: [],
        taxonomy_search: 'name',
};


const ImportField = ({
    item,
    index,
    setImportFields,
    fields,
    fromFields,
    setting,
}) =>
{
    const deleteImportField = (i) =>
    {
        setImportFields((prev) =>
        {
            const next = prev.slice();
            next.splice(i, 1);
            return next;
        });
    }

    const importFieldChange = (i, key, value) =>
    {
        setImportFields((prev) =>
        {
            const next = prev.slice();
            const newObj = {};
            newObj[key] = value;
            next[i] = {...prev[i], ...newObj};
            return next;
        });
    }

    const addImportFieldReplace = (i) =>
    {
        setImportFields((prev) =>
        {
            const next = prev.slice();
            next[i].replace.push({
                from: '',
                to: '',
            });
            return next;
        });
    }
    const removeImportFieldReplace = (i, ri) =>
    {
        setImportFields((prev) =>
        {
            const next = prev.slice();
            next[i].replace.splice(ri, 1);
            return next;
        });
    }

    const changeImportFieldReplace = (value, i, ri, key) =>
    {
        setImportFields((prev) =>
        {
            const next = prev.slice();
            next[i].replace[ri][key] = value;
            return next;
        });
    }




    return (
        <tr>
            <td>
                <select
                    onChange={(e) => importFieldChange(index, 'from', e.target.value) }
                    value={item.from}
                >
                <option value=""></option>
                {fromFields.length > 0 && (<>
                    {fromFields.map((item) =>
                        {
                            return <option value={item}>{setting.isNumberColumn ? parseInt(item): numToAlphabetColumn(parseInt(item))}</option>;
                        })
                    }
                </>) || (<>
                    {[...Array(26)].map((_, item) =>
                        {
                            return <option value={item}>{setting.isNumberColumn ? item: numToAlphabetColumn(item)}</option>;
                        })
                    }
                </>)}
                </select>
                {fromFields.length > 0 && !(item.from in fromFields) && (<small style={{ color: 'rgb(239 68 68)' }}>値がcsvカラムの範囲外です({setting.isNumberColumn ? parseInt(item.from) : numToAlphabetColumn(parseInt(item.from))})</small>) || (<></>)}
            →</td>
            <td>
                <input
                    type="text"
                    value={item.to}
                    onChange={(e) => importFieldChange(index, 'to', e.target.value) }
                />
                <span>
                {Object.keys(fields).find(key => item.to == key) &&
                    fields[Object.keys(fields).find(key => item.to == key)]
                }
                </span>
            </td>
            <td>
                <ul>
                {
                    item.replace.map((r_v, r_i) =>
                    {
                        return (<li>
                            <input type="text" value={r_v.from} size={6}
                                onChange={ (e) => changeImportFieldReplace(e.target.value, index, r_i, 'from') } />
                            →
                            <input type="text" value={r_v.to}   size={6}
                                onChange={ (e) => changeImportFieldReplace(e.target.value, index, r_i, 'to') } />


                            <button className="button small outline" onClick={() => removeImportFieldReplace(index, r_i)}>remove</button>
                        </li>);
                    })
                }
                </ul>
            <button className="button small outline" onClick={() => addImportFieldReplace(index)}>文字の置き換え追加</button>

            </td>
            <td>
                <button className="button small outline" onClick={() => deleteImportField(index)}>remove</button>
            </td>
        </tr>
    );
}

const ImportFields = ({
    fromFields,
    toFields,
    setting,
    setSetting,
}) =>
{
    const importFields = 'importFields' in setting ? setting['importFields'] : []

    const [ filter, setFilter ] = useState('')

    const setImportFields = (func) =>
    {
        const result = func(importFields)

        const newSetting = {...setting}
        newSetting['importFields'] = result
        setSetting(newSetting)
    }

    const addImportField = (name) =>
    {
        setImportFields((prev) =>
        {
            const newObj = {...ImportFieldDefault}; // TODO Lib 化して深いコピー
            newObj.replace = []; // TODO Lib 化して深いコピー
            newObj.to = name;
            const newArr = prev.slice();
            newArr.push(newObj)
            return newArr;
        });
    }

    const sortAsc = () =>
    {
        const newImportFields = importFields.sort((a, b) => {
            return parseInt(a.from) - parseInt(b.from)
        })
        setImportFields(() => {
            return newImportFields
        })
    }

    return <table className="ImportFields">
        <thead>
            <tr>
                <th>ファイルの〜から<button className="button small" onClick={sortAsc}>Sort</button></th>
                <th>〜にインポート</th>
                <th>文字の置き換え</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
        {
            importFields.map((item, i) =>
            {
                return <ImportField
                    item={item}
                    index={i}
                    setImportFields={setImportFields}
                    fields={toFields}
                    fromFields={fromFields}
                    setting={setting}
                />
            })
        }
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={4}>
                    <h2>to fields</h2>
                    <input type="text" size={40} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="multiple matches separated by spaces" />
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                {
                    Object.keys(toFields).map((key) =>
                    {
                        if (filter != '')
                        {
                            const filter_split = filter.split(' ')
                            for (let i = 0; i < filter_split.length; i++)
                            {
                                if (filter_split[i] == '') continue

                                if (!toFields[key].toLowerCase().includes(filter_split[i].toLowerCase()))
                                {
                                    return <></>
                                }
                            }
                        }

                        return (
                            <button
                                onClick={ () => addImportField(key) }
                                value={key}
                                className="button small outline"
                            >
                                {toFields[key]}
                            </button>
                        );
                    })
                }
                </td>
            </tr>
        </tfoot>
    </table>
}

export default ImportFields