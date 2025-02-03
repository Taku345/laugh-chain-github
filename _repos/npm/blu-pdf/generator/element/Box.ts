import Pdf from '../Pdf'
import { linesText, valuableReplace } from "./word";
import { PDFDocument, PDFPage, StandardFonts, rgb, RGB, PDFFont } from 'pdf-lib'
import { mm2pt, pt2mm, hex2RgbColor } from "../../classes/unit"
import ElementInterface from './ElementInterface'

const boxDefault = {
    'text'           : '',
    'x'              : 0,
    'y'              : 0,
    'yAlign'         : '',
    'width'          : 100,
    'height'         : 50,
    'hAuto'          : false,
    'paddingTop'     : 0,
    'paddingRight'   : 0,
    'paddingBottom'  : 0,
    'paddingLeft'    : 0,
    'marginTop'      : 0,
    'fontSize'       : 12,
    'fontFamily'     : 'gothic',
    'textAlign'      : '',
    'verticalAlign'  : '',
    'color'          : '',
    'lineHeight'     : 1.0,
    'letterSpacing'  : '',
    'backgroundColor': '',
    'borderWidthTop'      : 0,
    'borderWidthRight'    : 0,
    'borderWidthBottom'   : 0,
    'borderWidthLeft'     : 0,

    /*
    'value': '',
    'textX': '',
    'textY': '',
    'textWidth': 0, 
    'textHeight': 0, 
    'boxHeight': 0,
    'font': null,
    'colorRGB': null,
    */
}

const toPt = [
    'x',
    'y',
    'width',
    'height',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'marginTop',
    // '* lineHeihgt' => '',
    // '* letterSpacing' => '',
]

class Box implements ElementInterface
{
    text           : string
    x              : number
    y              : number
    yAlign         : number
    width          : number
    height         : number
    hAuto          : number
    paddingTop     : number
    paddingRight   : number
    paddingBottom  : number
    paddingLeft    : number
    marginTop      : number
    fontSize       : number
    fontFamily     : string
    textAlign      : string
    verticalAlign  : string
    color          : string
    lineHeight     : number
    letterSpacing  : number
    backgroundColor: number
    borderWidthTop      : number
    borderWidthRight    : number
    borderWidthBottom   : number
    borderWidthLeft     : number

    fontObject: PDFFont
    colorRGB: RGB

    textX: number
    textY: number
    textWidth: number
    textHeight:number
    value: string
    lines: { text: { text: string, w: number }, relativeY: number }[]
    requireHeight: number // marginTop と padding を含め、文字を改行した際に必要になる高さ

    constructor(pdf, format, data)
    {
        // フォーマット デフォルト値を適用
        Object.keys(boxDefault).map((key) =>
        {
            this[key] =  key in format ? format[key]: boxDefault[key]
        })

        // pt に単位を変更
        toPt.map((key) => {
            this[key] = mm2pt(this[key])
        })

        // color
        this.colorRGB = hex2RgbColor(this.color ?? '#000000')

        // text の描画範囲をとる
        this.textX = this.x + this.paddingLeft
        this.textWidth = this.width - (this.paddingLeft + this.paddingRight)
        this.textY = this.y + this.paddingTop + this.marginTop
        this.textHeight = this.height - (this.paddingTop + this.paddingBottom)

        // value の変数を処理
        this.value = valuableReplace(this.text, data)

        this.fontObject = pdf.getFont(this.fontFamily ?? 'gothic')

        // 適用した value 行ごとに分割、スタート地点からの相対距離を作成
        const lines_text = linesText(this.value, this.textWidth, this.fontSize, this.fontObject)
        this.lines = lines_text.map((lt, index) => {
            return {
                text: lt,
                relativeY: (this.lineHeight * this.fontSize) * (index+1) - (this.lineHeight * this.fontSize - this.fontSize) /2,
            }
        })

        this.requireHeight = this.lines.length < 1 ? 0 :
            this.paddingTop +
            this.paddingBottom +
            this.marginTop +
            (this.lineHeight * this.fontSize) * this.lines.length
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
        const requireTextHeight = (this.lineHeight * this.fontSize) * this.lines.length
        const height = this.getHeight()
        const textHeight = this.hAuto && (requireTextHeight > this.textHeight) ? requireTextHeight: this.textHeight

        this.lines.map((line) => {

            // align によって位置の変更
            const x = this.textAlign == 'right' ? this.textX + this.textWidth - line.text.w:
                this.textAlign == 'center' ? this.textX + ((this.textWidth - line.text.w) / 2) :
                this.textX

            const y = this.verticalAlign == 'bottom' ? this.textY + textHeight - requireTextHeight + line.relativeY:
                this.verticalAlign == 'middle' ? this.textY + (textHeight / 2) - (requireTextHeight/2) + line.relativeY:
                this.textY + line.relativeY

            // y のはみ出し
            if (! this.hAuto && (
                y < this.textY + (this.fontSize) || // padding は加味しない
                y > this.textY + textHeight // 下端
            ))
            {
                return
            }

            page.drawText(line.text.text, {
                x: x + add.x,
                y: y + add.y,
                size: this.fontSize,
                font: this.fontObject,
                color: this.colorRGB,
            })
        })

        // box の描画
        const corners = {
            l: this.x + add.x,
            r: this.x + add.x + this.width,
            t: this.y + add.y + this.marginTop,
            b: this.y + add.y + this.marginTop + height,
        }
        const lines = [
            /* 't': */ { w: this.borderWidthTop,    start: { x: corners.l - this.borderWidthLeft/2, y: corners.t }, end: { x: corners.r + this.borderWidthRight/2, y: corners.t } },
            /* 'r': */ { w: this.borderWidthRight,  start: { x: corners.r, y: corners.t + this.borderWidthTop/2 }, end: { x: corners.r, y: corners.b - this.borderWidthBottom/2 } },
            /* 'b': */ { w: this.borderWidthBottom, start: { x: corners.l - this.borderWidthLeft/2, y: corners.b }, end: { x: corners.r + this.borderWidthRight/2, y: corners.b } },
            /* 'l': */ { w: this.borderWidthLeft,   start: { x: corners.l, y: corners.t + this.borderWidthTop/2 }, end: { x: corners.l, y: corners.b - this.borderWidthBottom/2 } },
        ]
        lines.map((line) => {
            if (line.w <= 0) return
            page.drawLine({
                start : line.start,
                end   : line.end,
                thickness: line.w,
                color: rgb(0,0,0), opacity: 1.0,
            })
        })

        // return bounds
        return this.getBounds()
    }
}

export default Box