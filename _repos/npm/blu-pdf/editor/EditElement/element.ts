const paperNameDefault = '新しいPDF'
const elementNameDefault = '新しい要素'

const paperSizeOptions = {
    A3: { width: 297, height: 420 },
    B4: { width: 257, height: 364 },
    A4: { width: 210, height: 297 },
    B5: { width: 182, height: 257 },
    A5: { width: 148, height: 210 },
    B6: { width: 128, height: 182 },
}

const paperConfig = {
    name:            { default: paperNameDefault, unit: '' },
    width:           { default: 210,   unit: 'mm' },
    height:          { default: 297,   unit: 'mm' },
}


const elementConfig = {
    name:            { default: elementNameDefault, unit: '', types: ['text'], },
    value:           { default: "てすと{prop}テストです\nそれ方{hgoe}なり",    unit: '', types: ['text'], },
    x:               { default: 0,     unit: 'mm', types: ['text'], },
    y:               { default: 0,     unit: 'mm', types: ['text'], },
    yAlign:          { default: '',    unit: '', types: ['text'], },
    width:           { default: 50,    unit: 'mm', types: ['text'], },
    height:          { default: 25,    unit: 'mm', types: ['text'], },
    heightAuto:      { default: false, unit: '', types: ['text'], },
    paddingTop:      { default: 0,     unit: 'mm', types: ['text'], },
    paddingRight:    { default: 0,     unit: 'mm', types: ['text'], },
    paddingBottom:   { default: 0,     unit: 'mm', types: ['text'], },
    paddingLeft:     { default: 0,     unit: 'mm', types: ['text'], },
    marginTop:       { default: 0,     unit: 'mm', types: ['text'], },
    fontSize:        { default: 12,    unit: 'pt', types: ['text'], },
    fontFamily:      { default: '',    unit: '', types: ['text'], },
    textAlign:       { default: 'left',unit: '', types: ['text'], },
    verticalAlign:   { default: 'top', unit: '', types: ['text'], },
    color:           { default: 0,     unit: '', types: ['text'], },
    backgroundColor: { default: 0,     unit: '', types: ['text'], },
    borderTop:       { default: false, unit: 'mm', types: ['text'], },
    borderRight:     { default: false, unit: 'mm', types: ['text'], },
    borderBottom:    { default: false, unit: 'mm', types: ['text'], },
    borderLeft:      { default: false, unit: 'mm', types: ['text'], },

    // Editor で使う property
    focus: { default: true },
}

const defaultValues = (config) =>
{
    const defaults = {}
    for (const key in config)
    {
        defaults[key] = config[key].default
    }
    return defaults
}

export const defaultPaper = () =>
{
    return defaultValues(paperConfig)
}

export const defaultElement = () =>
{
    return defaultValues(elementConfig)
}