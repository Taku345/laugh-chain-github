import FieldInput from "blu/Components/Form/FieldInput"
import { useEffect, useState } from "react"


import DataTable from './Components/DataTable'
import { useSetting } from './Components/Setting'
import { useCsvReader } from './Components/CsvReader'
import { useSearchField }  from './Components/SearchField'
import { useImportFields }  from './Components/ImportFields'
import SearchFields from "blu/Components/Index/SearchFields"



const CsvImporter = ({
    ImportUrl,
    SettingsLoadApi,
    SettingsSaveApi,
    defaultSetting,
    settingKeys,
    toFields,
}) =>
{

    // まとめてインポートが
    // max ごとにインポート

    const runImport = () => {}
    const _runImport = () => {}
    const unImport = () => {}
    const nImport = () => {}
    const Import = () => {}


    const [ fromFields, setFromFields ] = useState([])
    const [ importRunning, setImportRunning ] = useState(false)

    const [ importResult, setImportResult ] = useState({});

    const { setting, tableComponent: settingComponent } = useSetting({});
    const { csvData, importTargets, setImportTargets, tableComponent: CsvReader } = useCsvReader()
    const { searchField, tableComponent: SearchField } = useSearchField({ fromFields, toFields })
    const { importFields, tableComponent: ImportFields } = useImportFields({ fromFields, toFields })
    

    useEffect(() => {
        if (csvData[0])
        {
            setFromFields(Object.keys(csvData[0]))
        }
        else
        {
            setFromFields([])
        }
        setImportResult({});
    }, [csvData])

    return (<div className="CsvImporter">

        {settingComponent}

        {CsvReader}

        {SearchField}
        {ImportFields}

        <DataTable
            csvData={csvData}
            setting={setting}
            toFields={toFields}
            searchField={searchField}
            importFields={importFields}
            importTargets={importTargets}
            setImportTargets={setImportTargets}
            importResult={importResult}
            setImportResult={setImportResult}
        />
    </div>)

}

export default CsvImporter