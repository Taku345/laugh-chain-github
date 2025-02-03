import React from 'react'
import Fields from '../../Components/View/Fields'
import { useForm } from '@inertiajs/react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

declare var route

const Show = ({
    auth,
    config,
    item,
    preference = ['*'],
    editUrl='',
    deleteUrl,
    disposeUrl,
}) =>
{
    const { delete: destroy, processing } = useForm({})

    const disposeItem = (data) =>
    {
        if (confirm(`「${data.id}」をゴミ箱に移動してもよろしいですか?`))
        {
            destroy(route('customer.dispose', { item: data.id} ), {
                preserveScroll: true,
                preserveState: true, // 検索の維持,
            })
        }
    }
    const deleteItem = (data) =>
    {
        if (confirm(`「${data.id}」を削除してもよろしいですか?\nこの操作は取り消せません。`))
        {
            destroy(route('customer.dispose', { item: data.id} ), {
                preserveScroll: true,
                preserveState: true, // 検索の維持,
            })
        }
    }



    const title = `顧客 - 閲覧「id: ${item.id}」`

    return (<>
        <section>
            <header>
                <h1>{title}</h1>
                <div className='button-group'>
                    {editUrl && (
                        <a className='button edit' href={editUrl}><ModeEditIcon />編集</a>
                    )}
                    {deleteUrl && (
                        <button className='button delete' disabled={processing} onClick={(e) => deleteItem(item)}><DeleteIcon />削除</button>
                    )}
                    {disposeUrl && (
                        <button className='button delete' disabled={processing} onClick={(e) => disposeItem(item)}><DeleteIcon />削除</button>
                    )}
                </div>
            </header>

            <div className='content'>
                <Fields
                    config={config}
                    data={item}
                    preference={preference}
                />
            </div>

            <footer className=''>
                <div className='button-group'>
                    {editUrl && (
                        <a className='button edit' href={editUrl}><ModeEditIcon />編集</a>
                    )}
                    {deleteUrl && (
                        <button className='button delete' disabled={processing} onClick={(e) => deleteItem(item)}><DeleteIcon />削除</button>
                    )}
                    {disposeUrl && (
                        <button className='button delete' disabled={processing} onClick={(e) => disposeItem(item)}><DeleteIcon />削除</button>
                    )}
                </div>
            </footer>
        </section>

    </>)
}
export default Show
