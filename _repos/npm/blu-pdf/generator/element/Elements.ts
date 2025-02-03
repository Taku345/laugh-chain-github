import Pdf from '../Pdf'
import { PDFPage } from 'pdf-lib'
import { mm2pt, pt2mm } from "../../classes/unit"
import Element from '.'
import ElementInterface from './ElementInterface'

class Elements implements ElementInterface
{
    pdf: Pdf
    page: PDFPage

    x              : number
    y              : number
    marginTop      : number

    width: number // コンストラクタでセット、外からの値は無視
    height: number // コンストラクタでセット、外からの値は無視

    elements : Element[][]

    constructor(format, data) // このデータは配列
    {
        this.elements = []

        // x, y のみもつ
        this.x         = 'x' in format ? mm2pt(format.x): 0
        this.y         = 'y' in format ? mm2pt(format.y): 0
        this.marginTop = 'marginTop' in format ? mm2pt(format.marginTop): 0


        // formats
        let totalWidth = 0
        
        data.map((datum) => {
            const elements_arr: Element[] = []
            format.elements.map((f) => {
                // 強制的に x, y を決定する
                f.x = totalWidth
                totalWidth += f.width
                f.y = 0
                f.hAuto = true

                elements_arr.push(new Element(f, datum))
            })
            this.elements.push(elements_arr)
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
        return this.hAuto && (this.requireHeight > this.height) ? this.requireHeight: this.height
    }

    setHeight(pt)
    {
        this.height = pt
    }

    getBounds()
    {
    }

    draw(page, add = { x: 0, y: 0 })
    {

        this.elements.map((b) => {
            const result = b.draw({
                x: add.x + this.x,
                y: add.y + this.y + this.marginTop
            })
        })

        // 最初のページを追加
        data.map((datum) => {
            format.map((f) => {
                if (f.nextData == 'page' || !this.pdf.getPage())
                {
                    const page = this.pdf.addPage()
                }
    
                f.elements.map((element) => {
                    
                })
            })
        })
    }


}

export default Elements