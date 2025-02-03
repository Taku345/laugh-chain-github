import { ReactSortable } from "react-sortablejs"
// sortable

const List = ({
    elements,
    setElements,
    selects,
    focusElement,
}) =>
{
    return (<>
        <ReactSortable
            tag='ul'
            list={elements}
            setList={(e) => e}
            animation={200}
        >
        {elements.map((element, index) => (<li onClick={(e) => {
            if (e.shiftKey)
            {
                focusElement(index, true)
            }
            else
            {
                focusElement(index, false)
            }
        }}>
            {element.name}
            <button>d</button>
        </li>))}
        </ReactSortable>
    </>)
}

export default List
