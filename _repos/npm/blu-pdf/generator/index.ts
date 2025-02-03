import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { fonts } from '../fonts/font'
import fontkit from '@pdf-lib/fontkit'
import Pdf from './Pdf'
import Element from './element'
import { pt2mm } from 'pdf-gui/classes/unit'

// 用紙の設定も受け取る
export const generate = async ({
    config,
    data = [],
}) =>
{

    const pdf = await Pdf.create()

    console.log(config)

    render(pdf, config, data)

    /*
    console.log('format', format)
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
    const gothicData = base64decode(fonts.gothic)
    const fontGothic = await pdfDoc.embedFont(gothicData, {subset: true});
    const minchoData = base64decode(fonts.gothic)
    const fontMincho = await pdfDoc.embedFont(minchoData, {subset: true});
    */



    /*
    const page = pdf.addPage()

    let before = null
    format.map((f) =>
    {
        console.log(f)
        if (before && f.yAlign == 'prevTop') f.y = before.mm.top
        if (before && f.yAlign == 'prevBottom') f.y = before.mm.bottom
        const element = new Element(pdf, page, f, {})
        before = element.draw()
    })
    */
    
    pdf.pdf.setTitle('Pdf Title')
    
  
    const pdfBytes = await pdf.pdf.save()

  
    return pdfBytes
}




const render = (pdf, config, data, parentBounds = null) =>
{
    let beforeBounds = parentBounds
    // 最初のページを追加
    data.map((datum) =>
    {

        config.formats.map((format) =>
        {
            if (parentBounds && config.prevAlign == 'top')    format.y = parentBounds.pt.top
            if (parentBounds && config.prevAlign == 'bottom') format.y = parentBounds.pt.bottom
            if (parentBounds && config.prevAlign == 'right')  format.x = parentBounds.pt.right
            if (parentBounds && config.prevAlign == 'left')   format.x = parentBounds.pt.left

            if (beforeBounds && format.prevAlign == 'top')    format.y = beforeBounds.pt.top
            if (beforeBounds && format.prevAlign == 'bottom') format.y = beforeBounds.pt.bottom
            if (beforeBounds && format.prevAlign == 'right')  format.x = beforeBounds.pt.right
            if (beforeBounds && format.prevAlign == 'left')   format.x = beforeBounds.pt.left

            if (format.nextData == 'page' || !pdf.getPage())
            {
                pdf.addPage() // TODO: size
            }

            format.elements.map((element) =>
            {
                if ('formats' in element)
                {
                    // TODO: data のリレーションや取り扱いを
                    beforeBounds = render(pdf, element, [{ t: '1' }, { t: '2' }, { t: '3' }, { t: '4' }, { t: '5' }], beforeBounds)
                }
                else
                {
                    if (beforeBounds && element.prevAlign == 'top')    element.y = beforeBounds.mm.top
                    if (beforeBounds && element.prevAlign == 'bottom') element.y = beforeBounds.mm.bottom
                    if (beforeBounds && element.prevAlign == 'right')  element.x = beforeBounds.mm.right
                    if (beforeBounds && element.prevAlign == 'left')   element.x = beforeBounds.mm.left

                    // 現在のページ
                    let page = pdf.getPage()

                    const ele = new Element(pdf, element, datum)

                    // 高さが超えたら、改ページ もしくは bounds の改行
                    if (beforeBounds && pdf.getPageHeight() < (beforeBounds.pt.bottom + ele.height))
                    {
                        page = pdf.addPage()
                    }
                    /*
                    if (beforeBounds && pdf.getPageWidth() < (beforeBounds.pt.right + ele.width))
                    {
                        page = pdf.addPage()
                    }
                    */
                    const relativeBeforeBounds = ele.draw(pdf.getPage(), { x: format.x, y: format.y })

                    beforeBounds = {
                        pt: {
                            left:   relativeBeforeBounds.pt.left   + format.x,
                            right:  relativeBeforeBounds.pt.right  + format.x,
                            top:    relativeBeforeBounds.pt.top    + format.y,
                            bottom: relativeBeforeBounds.pt.bottom + format.y,
                        },
                        mm: {
                            left:   pt2mm(relativeBeforeBounds.pt.left   + format.x),
                            right:  pt2mm(relativeBeforeBounds.pt.right  + format.x),
                            top:    pt2mm(relativeBeforeBounds.pt.top    + format.y),
                            bottom: pt2mm(relativeBeforeBounds.pt.bottom + format.y),
                        },
                    }

                    // 要素の高さがページを超えたらエラー
                }
            })
        })
    })

    return beforeBounds
}

// 用紙の開始位置から計算して、ページの高さを超えてしまう場合はエラーを投げる


/*
 * 要素の高さを(サイズ)を判定する
 * この結果を元にページを足すかどうか決定する
 */
const height = ({}) =>
{
    return {
        height: 9,
    }
}

/*
 * 要素を描画して、start を更新して返す
 * 改ページのコールバックを受け取り、
 */