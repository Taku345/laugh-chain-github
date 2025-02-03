import Pdf from '../Pdf'
import { PDFPage } from 'pdf-lib'
import { mm2pt, pt2mm } from "../../classes/unit"
import Element from '.'
import ElementInterface from './ElementInterface'

class TableRow
{
    x              : number
    y              : number
    marginTop      : number

    width: number // コンストラクタでセット、外からの値は無視
    height: number // コンストラクタでセット、外からの値は無視

    elements : Element[]

    constructor(format, data)
    {
        this.elements = []

        // x, y のみもつ
        this.x         = 'x' in format ? mm2pt(format.x): 0
        this.y         = 'y' in format ? mm2pt(format.y): 0
        this.marginTop = 'marginTop' in format ? mm2pt(format.marginTop): 0

        // formats
        let totalWidth = 0
        format.formats.map((f) => {
            // 強制的に x, y を決定する
            f.x = totalWidth
            totalWidth += f.width
            f.y = 0
            f.hAuto = true

            this.elements.push(new Element(f, data))
        })

        let height = 0
        let width = 0
        this.elements.map((b) => {
            height = Math.max(height, b.height)
            width += b.width
        })

        this.height = height
        this.width = width

        this.elements.map((b) => {
            b.height = height
        })
    }


    getWidth()
    {
        return this.width
    }

    getHeight()
    {
        return this.height
    }

    setHeight(pt)
    {
        // エラーを投げて何もしない
        // height 以上の時は設定しても良いかも?
    }

    getBounds()
    {
        const height = this.getHeight()
        return {
            pt: {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.marginTop + height,
            },
            mm: {
                left:   pt2mm(this.x),
                right:  pt2mm(this.x + this.width),
                top:    pt2mm(this.y),
                bottom: pt2mm(this.y + this.marginTop + height),
            },
        }
    }


    draw(page, add = { x: 0, y: 0 })
    {
        const boundsPt = {
            top: Infinity,
            left: Infinity,
            right: 0,
            bottom: 0,
        }
        this.elements.map((b) => {
            const result = b.draw({
                x: add.x + this.x,
                y: add.y + this.y + this.marginTop
            })

            boundsPt.top = Math.min(boundsPt.top, result.pt.top)
            boundsPt.left = Math.min(boundsPt.left, result.pt.left)
            boundsPt.right = Math.max(boundsPt.right, result.pt.right)
            boundsPt.bottom = Math.max(boundsPt.bottom, result.pt.bottom)
        })

        return this.getBounds()
        return {
            pt: {
                left:   boundsPt.left + this.x,
                right:  boundsPt.right + this.x,
                top:    boundsPt.top + this.y,
                bottom: boundsPt.bottom + this.y,
            },
            mm: {
                left:   pt2mm(boundsPt.left + this.x),
                right:  pt2mm(boundsPt.right + this.x),
                top:    pt2mm(boundsPt.top + this.y),
                bottom: pt2mm(boundsPt.bottom + this.y),
            },
        }
    }
}

export default TableRow
