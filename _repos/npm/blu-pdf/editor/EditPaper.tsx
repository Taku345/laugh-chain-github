import { usePaperContext } from "."
import FieldWrap from "./EditElement/FieldWrap"

const EditPaper = ({
    elements,
    setElements,
    selects,
}) =>
{
    const { paper, setPaper } = usePaperContext()

    const updatePaper = (key, value) =>
    {
        setPaper((prev) => {
            const newPaper = {...prev}
            newPaper[key] = value
            return newPaper
        });
    }

    const selectPaper = (key) =>
    {
        
    }

    return (<>
        <FieldWrap label='width'>
            <input type='text' value={paper.width} onChange={(e) => updatePaper('width', e.target.value)} />
        </FieldWrap>
        <FieldWrap label='height'>
            <input type='text' value={paper.height} onChange={(e) => updatePaper('height', e.target.value)} />
        </FieldWrap>
    </>)

}

export default EditPaper