interface ElementInterface
{
    getWidth(): number
    getHeight(): number
    setHeight(pt: number): void
    getBounds(): any
    draw(page, add: {x: number, y:number})
}


export default ElementInterface