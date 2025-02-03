import Pdf from './Pdf'
import { PDFDocument, PDFPage, PageSizes } from 'pdf-lib'

class Page
{
    pdf: Pdf
    page: PDFPage
    

    constructor(pdf: Pdf, pageSize: [number, number] = null)
    {
        this.pdf = pdf
        this.page = pageSize ? pdf.pdf.addPage(pageSize) : pdf.pdf.addPage(PageSizes.A4)
    }

    drawText(text, options)
    {
        options.y = this.ylb(options.y)
        this.page.drawText(text, options)
    }

    drawLine(options)
    {
        options.start = { x: options.start.x, y: this.ylb(options.start.y) }
        options.end   = { x: options.end.x  , y: this.ylb(options.end.y)   }

        this.page.drawText(options)
    }

    ylb(y)
    {
        return this.page.getHeight() - y
    }


}

export default Page