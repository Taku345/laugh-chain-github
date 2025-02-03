import FieldWrap from "./EditElement/FieldWrap"

const EditElement = ({
    elements,
    setElements,
}) =>
{
    const valueWithMultiple = (key) =>
    {
        const returnValues = []
        elements.map((element) => {
            if (element.focus && returnValues.indexOf(element[key]) < 0)
            {
                returnValues.push(element[key])
            }
        })

        if (returnValues.length == 1)
        {
            return returnValues
        }
        else if (returnValues.length < 1)
        {
            return null
        }
        else
        {
            return 'Multiple'
        }
    }

    const updateElements = (key, value) =>
    {
        const newElements = elements.map((element) =>
        {
            if (element.focus) element[key] = value
            return element
        });

        setElements(newElements)
    }

    // elements focus がなければ表示しない

    return (<>

        type → text, image, table

        Properties

        タイプごとのものと共通のもので分ける

        value が multipleか

        <FieldWrap label='name'>
            <input type='text' value={valueWithMultiple('name')} onChange={(e) => updateElements('name', e.target.value)} />
        </FieldWrap>

        <FieldWrap label='value'>
            <textarea value={valueWithMultiple('value')} onChange={(e) => updateElements('value', e.target.value)} />
        </FieldWrap>

        <FieldWrap label='x' unit='mm'>
            <input type='text' value={valueWithMultiple('x')} onChange={(e) => updateElements('x', e.target.value)} />
        </FieldWrap>
        <FieldWrap label='y' unit='mm'>
            <input type='text' value={valueWithMultiple('y')} onChange={(e) => updateElements('y', e.target.value)} disabled={valueWithMultiple('yAlign')} />
        </FieldWrap>
        <FieldWrap label='yAlign' unit='mm'>
            <select value={valueWithMultiple('yAlign')} >
                <option value=''></option>
                <option value='pervTop'>前の要素の上端揃え</option>
                <option value='pervBottom'>前の要素のした端揃え</option>
                <option value='Multiple'>Multiple</option>
            </select>
        </FieldWrap>
        
        <FieldWrap label='w' unit='mm'>
            <input type='text' value={valueWithMultiple('width')} onChange={(e) => updateElements('width', e.target.value)} />
        </FieldWrap>
        <FieldWrap label='h' unit='mm'>
            <input type='text' value={valueWithMultiple('height')} onChange={(e) => updateElements('height', e.target.value)} />
        </FieldWrap>
        <FieldWrap label='hAuto' unit='mm'>
            <input type='checkbox' />
        </FieldWrap>

        paddingTop
        paddingRight
        paddingBottom
        paddingLeft
        marginTop

        fontSize
        fontFamily
        textAlign
        verticalAlign
        color
        <FieldWrap label='color' unit='mm'>
            <input type='color' value={valueWithMultiple('color')} onChange={(e) => updateElements('color', e.target.value)} />
        </FieldWrap>
        * lineHeihgt
        * letterSpacing

        backgroundColor
        borderTop
        borderRight
        borderBottom
        borderLeft
    </>)

}

export default EditElement