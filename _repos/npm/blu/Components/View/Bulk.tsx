import { createElement, Fragment } from 'react'
import Head from './Bulk/Head'
import Body from './Bulk/Body'

// ボタンの文字列を変更可能に => 'アイコンに変更'
// 並べ替えを上下ボタンに設定
// 並べ替え・削除の有効・無効
// TODO: => Bulk 以下にのみ有効なコンテキストを設定する? => useBulk を使っていると難しい

type BulkProps = {
    tag?:string,
    config: any,
    bulkData: any[],
}

export const useBulk = ({
    tag = 'table',
    config,
    bulkData, // array
}: BulkProps) =>
{
    // fieldData が array でなければ array であることを保証する TODO: bulk へ
    if (!Array.isArray(bulkData)) bulkData = []

    return {
        tag: tag != 'table' ? Fragment : tag,
        head: <Head
            tag={tag}
            config={config}
        />,
        body: <Body
            tag={tag}
            config={config}
            bulkData={bulkData}
        />
    }
}

const Bulk = (props: BulkProps) =>
{
    const {
        head,
        body,
        tag,
    } = useBulk(props)

    return (<div className='Bulk'>
        {createElement(
            tag,
            typeof tag == 'string' ? { className: 'Bulk' } : {},
            <>
                {head}
                {body}
            </>
        )}
    </div>)

}

export default Bulk