import { PDFDocument , StandardFonts, rgb, PDFPage, PDFFont, PageSizes } from 'pdf-lib'
import Page from './Page'
// import fontkit from '@pdf-lib/fontkit'
import fontkit from '@pdf-lib/fontkit'
import { fonts } from '../fonts/font'
import { base64decode } from '../classes/data'
import { mm2pt } from '../classes/unit'


class Pdf
{
    pdf: PDFDocument
    pages: Page[]
    fonts: { [key: string]: PDFFont }
    pageSize: [number, number]
    fontName: string

    constructor()
    {
        // デフォルトの font をセットする(日本語フォント)
        this.pages = [];
    }

    static async create()
    {
        const obj = new Pdf();
        obj.pdf = await PDFDocument.create();

        // font も非同期なのでここでデフォルトを初期化
        obj.pdf.registerFontkit(fontkit)
        obj.fonts = {}
        const gothicData = base64decode(fonts.gothic)
        await obj.addFont('gothic', gothicData)
        const minchoData = base64decode(fonts.mincho)
        await obj.addFont('mincho', minchoData)

        return obj;
    }

    async addFont(fontName, fontData)
    {
        const font = await this.pdf.embedFont(fontData, {subset: true});
        this.fonts[fontName] = font
        this.fontName = fontName
        return font
    }

    getFont(fontName?)
    {
        return this.fonts[fontName ?? this.fontName]
    }

    addPage = (size?: [number, number]) =>
    {
        // 保存されているサイズがあれば、それでページを保存
        const page = new Page(this, size)
        this.pages.push(page)

        return page
    }

    getPage = (number? : number) =>
    {
        if (number && number in this.pages)
        {
            return this.pages[number]
        }

        // 指定されていなければ最後のページを返す
        return this.pages[this.pages.length - 1] ?? null
    }

    getPageHeight = (number?: number) =>
    {
        return this.getPage(number).page.getHeight()
    }

    drawBox = () =>
    {
        // height が
        const page = this.getPage()
    }

    


    /*

    _textHeight = () =>
    {
        const lineMargin = fontSize * lineHeight - fontSize;
		const lines = Util.linesText(text, w - paddings.L - paddings.R, 12, font);
		const textHeight = lines.length * fontSize + ((lines.length) * lineMargin) + (font.sizeAtHeight(fontSize) - fontSize) + paddings.T + paddings.B;

		const boxHeight = overText ? Math.max(textHeight + paddings.T + paddings.B, h ) : h;
    }
    */

}

export default Pdf