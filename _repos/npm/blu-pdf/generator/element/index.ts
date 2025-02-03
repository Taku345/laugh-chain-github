import Box from './Box'
import TableRow from './Row'
import Elements from './Elements'
import { mm2pt } from 'pdf-gui/classes/unit'
import ElementInterface from './ElementInterface'

class Element
{
    element: ElementInterface

    constructor(pdf, format, datum)
    {
        switch (format.type)
        {
        case 'elements':
            this.element = new Elements(format, datum)
        case 'row':
            this.element = new TableRow(format, datum)
            break;
        default:
            this.element = new Box(pdf, format, datum)
            break
        }
    }

    get width()
    {
        return this.element.getHeight()
    }

    get height()
    {
        return this.element.getHeight()
    }

    set height(pt)
    {
        this.element.setHeight(pt)
    }
    setHeightMm(mm)
    {
        this.height = mm2pt(mm)
    }

    draw(page, add = { x: 0, y: 0 })
    {
        return this.element.draw(page, add)
    }


}

export default Element