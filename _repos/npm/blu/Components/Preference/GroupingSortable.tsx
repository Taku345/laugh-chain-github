import { createElement } from 'react'
import { arrayMoveImmutable } from 'array-move'
import { ReactSortable } from 'react-sortablejs'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveIcon from '@mui/icons-material/Remove';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { toArr } from '../../classes/util';

const GroupingSortable = ({
    elements,
    setElements,
    renderComponent,
    elementsLibrary,
}) =>
{
    console.log('grouping')
    const onParent = (e) =>
    {
        // 親も同様にaddとsort を別々で処理
        if (e.from == e.to) // parent => prent
        {
            // ただのソート
            const newElements = arrayMoveImmutable(elements, e.oldIndex, e.newIndex)
            setElements(newElements)
        }
        else if (e.type == 'add') // child => parent
        {
            const newElements = elements.slice();
            if (e.from.classList.contains('library'))
            {
                const elementIndex = e.item.dataset.elementIndex
                newElements.splice(e.newIndex, 0, elementsLibrary[elementIndex])
            }
            else // child => parent
            {
                const fromParentIndex = parseInt(e.item.dataset.parentIndex)
                const fromElements = newElements[fromParentIndex].filter((elm, i) => {
                    return i != e.oldIndex
                })

                if (fromElements.length > 1)
                {
                    newElements[fromParentIndex] = fromElements
                }
                else if (fromElements.length == 1)
                {
                    newElements[fromParentIndex] = fromElements[0]
                }
                else
                {
                    newElements.splice(fromParentIndex, 1)
                }


                newElements.splice(e.newIndex, 0, elements[fromParentIndex][e.oldIndex])
            }

            setElements(newElements)
        }
    }

    const onChild = (e, parentIndex) =>
    {
        if (e.from == e.to) // child => child ( self => self )
        {
            // ただのソート
            const newElements = elements.slice();
            newElements[parentIndex] = arrayMoveImmutable(newElements[parentIndex], e.oldIndex, e.newIndex)
            setElements(newElements)
        }
        else if (e.type == 'add') // * => child
        {
            // add のみを処理
            const newElements = elements.slice();
            if (e.from.classList.contains('library'))
            {
                const elementIndex = e.item.dataset.elementIndex
                newElements[parentIndex] = [
                    ...toArr(newElements[parentIndex]).slice(0, e.newIndex),
                    ...toArr(elementsLibrary[elementIndex]),
                    ...toArr(newElements[parentIndex]).slice(e.newIndex),
                ]
            }
            else if (e.from.classList.contains('parent')) // parent => child
            {
                const fromParentIndex = parseInt(e.item.dataset.parentIndex)

                newElements[parentIndex] = [
                    ...toArr(newElements[parentIndex]).slice(0, e.newIndex),
                    ...toArr( elements[fromParentIndex] ),
                    ...toArr(newElements[parentIndex]).slice(e.newIndex),
                ]

                newElements.splice(fromParentIndex, 1)
            }
            else // child => child (another => self) 
            {
                console.log('chikd')
                const fromParentIndex = parseInt(e.item.dataset.parentIndex)

                newElements[parentIndex] = [
                    ...toArr(newElements[parentIndex]).slice(0, e.newIndex),
                    ...toArr( elements[fromParentIndex][e.oldIndex] ),
                    ...toArr(newElements[parentIndex]).slice(e.newIndex),
                ]

                const fromElements = newElements[fromParentIndex].filter((elm, i) => {
                    return i != e.oldIndex
                })
                console.log('fromElm', fromElements)
                if (fromElements.length > 1)
                {
                    newElements[fromParentIndex] = fromElements
                }
                else if (fromElements.length == 1)
                {
                    newElements[fromParentIndex] = fromElements[0]
                }
                else
                {
                    newElements.splice(fromParentIndex, 1)
                }
            }
            setElements(newElements)
        }
    }

    const remove = (index, parentIndex) =>
    {
        const newElements = elements.slice()
        if (parentIndex > -1)
        {
            newElements[parentIndex] = newElements[parentIndex].filter((e, i) => i != index)
            if (newElements[parentIndex].length < 1)
            {
                newElements.splice(parentIndex, 1)
            }
            else if (newElements[parentIndex].length == 1)
            {
                newElements[parentIndex] = newElements[parentIndex][0]
            }
            setElements(newElements)
        }
        else
        {
            setElements(newElements.filter((e, i) => i != index))
        }
    }

    // TODO: hadle のクラスを追加して、child の単体の div は動かせないように

    return (<div className='GroupingSortable'>
        <ReactSortable
            tag='div'
            list={elements}
            setList={() => false }
            onSort={ (e) => onParent(e) }
            onAdd={ (e) => onParent(e) }
            group='nested'
            className=' SortableParent parent'

            fallbackOnBody
            swapThreshold={0.65}
            animation={150}
            handle='.handle-parent'
        >
        {elements.map((rowData, index) => (<div className='SortableParentElement SortableElement' data-parent-index={index} key={index}>
            <button className='handle-parent button small'><DragIndicatorIcon /></button>
            <ReactSortable
                tag='div'
                className={`SortableChild child ${Array.isArray(rowData) ? '' :'single'}`}
                list={rowData}
                setList={ (e) => false }
                onSort={ (e) => onChild(e, index) }
                onAdd={ (e) => onChild(e, index) }
                group='nested'
                fallbackOnBody
                swapThreshold={0.65}
                animation={150}
                handle='.handle-child'
            >

                {Array.isArray(rowData) && (<>
                    {rowData.map((rd, rdi) => (<div className='SortableChildElement SortableElement' data-parent-index={index} key={rdi}>
                        <button className='handle-child button small'><DragIndicatorIcon /></button>
                        <div className='content'>
                        {createElement(
                            renderComponent,
                            {
                                data: rd,
                                index: rdi,
                                parentIndex: index,
                            }
                        )}
                        </div>
                        <button className='button small delete' onClick={() => remove(rdi, index)}><RemoveIcon /></button>
                    </div>))}
                </>) || (<div className=''>
                    <div className='content'>
                    {createElement(
                        renderComponent,
                        {
                            data: rowData,
                            index: index,
                            parentIndex: null,
                        }
                    )}
                    </div>
                </div>)}
            </ReactSortable>
            <button className='button small delete' onClick={() => remove(index, -1)}><RemoveIcon /></button>


        </div>))}
        </ReactSortable>
        

        <ReactSortable
                tag='div'
                className={`SortableLibrary library`}
                list={elementsLibrary.filter((ck) => !elements.flat().includes(ck))}
                setList={ (e) => false }
                onSort={ (e) => false }
                onAdd={ (e) => false }
                sort={false}
                group='nested'
                fallbackOnBody
                swapThreshold={0.65}
                animation={150}
                handle='.handle-child'
            >
            {elementsLibrary.map((libElement, index) => (<>
                {!elements.flat().includes(libElement) && (<div className='SortableElement' data-element-index={index}>
                    <button className='handle-child button small'><DragIndicatorIcon /></button>
                    <div className='content'>
                    {createElement(
                        renderComponent,
                        {
                            data: libElement,
                            index: index,
                            parentIndex: null,
                        }
                    )}
                    </div>
                </div>)}
            </>))}

        </ReactSortable>
    </div>)
}

export default GroupingSortable
