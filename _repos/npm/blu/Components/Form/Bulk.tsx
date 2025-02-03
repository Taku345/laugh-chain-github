import { createElement, Fragment, createContext } from 'react'
import { defaultDataFromConfig } from '../../classes/model'
import Head from './Bulk/Head'
import Foot from './Bulk/Foot'
import Body from './Bulk/Body'
import isEqual from 'lodash.isequal'
import AddIcon from '@mui/icons-material/Add';

// ボタンの文字列を変更可能に => 'アイコンに変更'
// 並べ替えを上下ボタンに設定
// 並べ替え・削除の有効・無効
// TODO: => Bulk 以下にのみ有効なコンテキストを設定する? => useBulk を使っていると難しい

type BulkProps = {
    name?: string,
    tag?:string,
    config: any,
    bulkData: any[],
    setBulkData: (v:any) => void,
    bulkErrors: [],
    addable?: boolean,
    deletable?: boolean,
    addButtonText?: string,
}

export const useBulk = ({
    name='',
    tag = 'table',
    config,
    bulkData, // array
    setBulkData,
    bulkErrors, // array
    addable=true,
    deletable=true,
    addButtonText = '新規列を追加',
}: BulkProps) =>
{
    // config に chosen カラムがあれば警告

    // fieldData が array でなければ array であることを保証する TODO: bulk へ
    if (!Array.isArray(bulkData)) bulkData = []

    // order のフィールドがあるかどうか、あれば並べ替え時をセットする。
    const sortKeys = Object.keys(config).filter((key) => config[key]?.type == 'order')

    const add = () =>
    {
        const newBulkData = bulkData.slice()
        newBulkData.push(defaultDataFromConfig(config))
        setBulkData(orderedBulkData(newBulkData))
    }

    const removeRow = (index) =>
    {
        if (!confirm('削除してもよろしいですか?')) return
        const newBulkData = bulkData.slice()
        newBulkData.splice(index, 1)
        setBulkData(orderedBulkData(newBulkData))
    }

    const sortCallBack = (newBulkData) =>
    {
        // 初期化時も走るので confirm before unload 対策
        if (isEqual(bulkData, newBulkData)) return

        setBulkData(orderedBulkData(newBulkData))
    }

    const orderedBulkData = (newBulkData) => 
    {
        return newBulkData.map((elm, index) =>
        {
            // order カラムがあればセット
            if (sortKeys.length > 0)
            {
                sortKeys.map((key) =>
                {
                    elm[key] = index+1
                })
            }
            // chosen 削除
            delete elm['chosen']
            return elm
        }) 
    }

    const setBulkRowData = (index, newRowData) =>
    {
        const newBulkData = bulkData.slice()
        newBulkData[index] = newRowData
        setBulkData(newBulkData)
    }

    return {
        tag: tag != 'table' ? Fragment : tag,
        head: <Head
            tag={tag}
            config={config}
        />,
        body: <Body
            name={name}
            tag={tag}
            config={config}
            removeRow={deletable ? removeRow: null}
            bulkData={bulkData}
            setBulkData={setBulkData}
            bulkErrors={bulkErrors}
            sortKeys={sortKeys}
            sortCallBack={sortCallBack}
            setBulkRowData={setBulkRowData}
        />,
        foot: addable && (<Foot
            tag={tag}
            config={config}
            control = {<button className='button outline' onClick={add}><AddIcon />{addButtonText}</button>}
        />) || (<></>),
        add,
        removeRow,
        orderedBulkData,
        sortCallBack,
        setBulkRowData,
    }
}

const Bulk = (props: BulkProps) =>
{
    const {
        head,
        body,
        foot,
        tag,
    } = useBulk(props)
    


    return (<div className='Bulk'>
        {createElement(
            tag,
            {},
            <>
                {head}
                {body}
                {foot}
            </>
        )}
    </div>)

}

export default Bulk