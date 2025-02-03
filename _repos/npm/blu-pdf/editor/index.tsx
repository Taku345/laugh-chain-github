import { useState, createContext, useContext } from 'react'
import { defaultPaper, defaultElement } from './EditElement/element'
import Renderer from './Renderer'
import List from './List'
import EditPaper from './EditPaper'
import EditElement from './EditElement'
import Panel from './Panel'

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';


import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

import '../sass/pdf-gui.scss'
import HeaderMenu from './HeaderMenu'

const PaperContext = createContext({})

const PaperContextProvider = ({
    defaultPaper,
    children
}) =>
{
    const [ paper, setPaper ] = useState(defaultPaper)
    const [ zoom, setZoom ] = useState(4)
    const [ grid, setGrid ] = useState(0)

    const _mm2px = zoom

    const mm2px = (mm) => mm * _mm2px
    const px2mm = (px) => px * (1.0 / _mm2px)
	const _pt2mm = 2.8346;
    const pt2mm = (pt) => pt * 2.8346
    const mm2pt = (mm) => mm * (1.0 / 2.8346)
    const pt2px = (pt) => mm2px(pt2mm(pt))
    const px2pt = (px) => mm2pt(px2mm(px))

    return (<PaperContext.Provider
        value={{
            paper, setPaper,
            mm2px,
            px2mm,
            pt2mm,
            mm2pt,
            pt2px,
            px2pt,
            zoom, setZoom,
            grid, setGrid,
        }}
    >
        {children}
    </PaperContext.Provider>
    )
}

export const usePaperContext = () => useContext(PaperContext)

const useEditor = ({
    defaultElements=[]
}) =>
{
    const [ elements, setElements ] = useState(defaultElements)

    const add = () =>
    {
        setElements((prev) =>
        {
            const newElements = prev.map((pe) => {
                pe.focus = false
                return pe
            })
            newElements.push(defaultElement())
            return newElements
        })
    }

    const focusElement = (index, append = false) =>
    {
        setElements((prev) =>
        {
            const newElements = append ? prev.slice(): prev.map((pe) => {
                pe.focus = false
                return pe
            })
            newElements[index].focus = true
            return newElements
        })
    }

    return {
        elements,
        setElements,
        add,
        focusElement
    }
}

const Editor = (props) =>
{
    const { elements, setElements, add, focusElement } = useEditor(props)
    
    const [ focusPanel, setFocusPanel ] = useState('');

    const [ zoom, setZoom ] = useState(4)

    return (<div className="PdfGui Editor">
        <PaperContextProvider defaultPaper={defaultPaper()}>

            <HeaderMenu
                add={add}
            />

            <Renderer
                elements={elements}
                setElements={setElements}
                focusElement={focusElement}
            />

            <Panel
                title='用紙設定'
                className='EditPaper'
                focusPanel={focusPanel}
                setFocusPanel={setFocusPanel}
            >
                <EditPaper
                    elements={elements}
                    focusElement={focusElement}
                />
            </Panel>

            <Panel
                title='List'
                className='List'
                focusPanel={focusPanel}
                setFocusPanel={setFocusPanel}
            >
                <List
                    elements={elements}
                    focusElement={focusElement}
                />
            </Panel>

            <Panel
                title='Edit Element'
                className='EditElement'
                focusPanel={focusPanel}
                setFocusPanel={setFocusPanel}
            >
                <EditElement
                    elements={elements}
                    setElements={setElements}
                />
            </Panel>

        </PaperContextProvider>
    </div>)
}

export default Editor