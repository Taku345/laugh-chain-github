import Text from "./Element/Text"
import { usePaperContext } from "."

import { Rnd } from 'react-rnd';
const Element = ({
    index,
    element,
    setElement,
    focusElement,
}) =>
{
    const { mm2px, px2mm, pt2px, } = usePaperContext()


    const grid = 5;
    const snapGrid = (mmValue) =>
    {
        return Math.round(mmValue/grid)*grid
    }

    return <Rnd
        className={`Element ${element.focus ? 'draggable': ''}`}
        style={{
            position: 'absolute',
            zIndex: element.focus ? 1: 0,
        }}
        size={{
            width: mm2px(element.width),
            height: mm2px(element.height),
        }}
        position={{
            x: mm2px(element.x),
            y: mm2px(element.y)
        }}

        onClick={() => focusElement(index)}

        onDragStop={(e, d) => {
            const newElm = {...element}
            newElm.x = snapGrid(px2mm(d.x))
            newElm.y = snapGrid(px2mm(d.y))
            setElement(newElm)
        }}

        enableResizing={true /* type で変更 */ }
        onResizeStop={(e, direction, ref, delta, position) => {
            const newElm = {...element}
            newElm.x = snapGrid(px2mm(position.x))
            newElm.y = snapGrid(px2mm(position.y))
            newElm.width = snapGrid(px2mm(ref.style.width.replace('px', '')))
            newElm.height = snapGrid(px2mm(ref.style.height.replace('px', '')))
            setElement(newElm)
        }}

        data-index={index}
    >
        <span className="">{element.name}</span>
        <Text
            value={element.value}
        />
    </Rnd>
}

export default Element