import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react'

import Papa from 'papaparse'





/**
 * 後々、API も足す
 */
export const useCsvReader = () =>
{

    const [ fileName, setFileName ] = useState('')
    const [ csvData, setCsvData ] = useState([])
    const [ importTargets, setImportTargets ] = useState({});
    const [ fromFields, setFromFields ] = useState([])


    const FileRead = (e) =>
    {
        e.preventDefault();
        e.stopPropagation();
        const files = e.target.files;

        const file = files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) =>
        {
            const result = e.target.result;

            const papa = Papa.parse(result);
            const csvArr = papa.data
            console.log('paraparse', papa.data);
            
            // const csvArr = csvArray(result);

            let colsNum = 0;
            for (let i =0; i < csvArr.length; i++)
            {
                colsNum = Math.max(csvArr[i].length, colsNum);
            }

            setFileName(file.name)
            setCsvData(csvArr);
            setImportTargets({})
            if (csvArr[0])
            {
                setFromFields(Object.keys(csvArr[0]))
            }
            else
            {
                setFromFields([])
            }
        }

        // reader.readAsArrayBuffer(f);
        reader.readAsBinaryString(file); // TODO fxxk ie
    }

    const tableComponent = <table className="CsvReader">
        <tbody>
            <tr>
                <th>ファイル読み込み</th>
                <td>
                    <input type="file" onChange={FileRead} />
                </td>
            </tr>
        </tbody>
    </table>

    return {
        fileName,
        csvData,
        setCsvData,
        fromFields,
        importTargets,
        setImportTargets,
        tableComponent
    }

}
