import { useState } from 'react';

export const searchFieldDefault = {
        from: '',
        to: '',
        replace: [],
        compare: '=',

};

const SearchField = ({
    fromFields,
    toFields,
    setting,
    setSetting,
}) =>
{
    const searchField = 'searchField' in setting ? setting['searchField'] : searchFieldDefault
    const setSearchField = (func) =>
    {
        const result = func(searchField)

        const newSetting = {...setting}
        newSetting['searchField'] = result
        setSetting(newSetting)
    }


    const changeSearchField = (key, value) =>
    {
        setSearchField((prev) =>
        {
            const next = {...prev};
            next[key] = value;
            return next;
        });
    }

    const addSearchReplace = () =>
    {
        setSearchField((prev) =>
        {
            const next = {...prev};
            if (!Array.isArray(next.replace)) next.replace = []
            next.replace = [...next.replace, {
                from: '',
                to: '',
            }];
            return next;
        });
    }
    const removeSearchReplace = (i) =>
    {
        setSearchField((prev) =>
        {
            const next = {...prev};
            if (!Array.isArray(next.replace)) next.replace = []
            next.replace.splice(i, 1);
            return next;
        });
    }
    const changeSearchReplace = (value, i, key) =>
    {
        setSearchField((prev) =>
        {
            const next = {...prev};
            if (!Array.isArray(next.replace)) next.replace = []
            next.replace[i][key] = value;
            return next;
        });
    }


    return <table className="SeearchField">
        <thead>
            <tr>
                <th>ファイルの〜と</th>
                <th>〜を検索</th>
                <th>文字の置き換え</th>
                <th>検索メソッド</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <select
                        value={searchField.from}
                        onChange={(e) => changeSearchField('from', e.target.value)}
                    >
                        <option value=""></option>
                        {fromFields && fromFields.map((item) =>
                            {
                                return <option value={item}>{item}</option>;
                            })
                        }
                    </select>

                </td>
                <td>
                    <select
                        value={searchField.to}
                        onChange={(e) => changeSearchField('to', e.target.value)}
                    >
                        <option value=""></option>
                        <option value="id">ID</option>
                        {Object.keys(toFields).map((key) =>
                        {
                            return <option value={key}>{toFields[key]}</option>
                        })}
                    </select>
                </td>
                <td>
                    <ul>
                    {Array.isArray(searchField.replace) && (
                        searchField.replace.map((v, i) => 
                        {
                            return (<li>
                                <input type="text" value={v.from} size={6} onChange={ (e) => changeSearchReplace(e.target.value, i, 'from') } />
                                →
                                <input type="text" value={v.to}   size={6} onChange={ (e) => changeSearchReplace(e.target.value, i, 'to') } />
                                <button className="button small" onClick={() => removeSearchReplace(i)}>remove</button>
                            </li>);
                        })
                    )}
                    </ul>
                    <button className="button small" onClick={addSearchReplace}>追加</button>
                </td>
                <td>
                    <select
                        value={searchField.compare}
                        onChange={(e) => changeSearchField('compare', e.target.value)}
                    >
                        <option value="=">完全一致</option>
                        <option value="like">あいまい検索</option>
                    </select>
                    <p>※あいまい検索では「%」をワイルドカードとして使用できます。</p>
                </td>
            </tr>
        </tbody>
    </table>
}

export default SearchField
