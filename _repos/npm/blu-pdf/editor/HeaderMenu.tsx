import { usePaperContext } from "."

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const HeaderMenu = ({
    add
}) =>
{
    const { zoom, setZoom } = usePaperContext()

    return (<header>

        <nav className="add">
            <button className="" onClick={add}>Add</button>
        </nav>
        <nav className="zoom">
            <button className="" onClick={ () => setZoom(Math.max(1, zoom-1)) }><RemoveIcon style={{ fontSize: '1em'}} /></button>
            <button className="" onClick={ () => setZoom(4) }>100%</button>
            <button className="" onClick={ () => setZoom(Math.min(10, zoom+1)) }><AddIcon  style={{ fontSize: '1em'}} /></button>
            <button className="" onClick={ () => false }></button>
        </nav>
        <nav className="view">
            <button className="" onClick={ () => false }>name</button>
            <button className="" onClick={ () => false }>value</button>
            <button className="" onClick={ () => false }>枠</button>
        </nav>
        <nav className="grid">
            <button className="" onClick={ () => false }>Grid</button>
            <input type="number" list="grid-size" />
            <datalist id="grid-size">
                <option value="1" />
                <option value="2" />
                <option value="5" />
                <option value="10" />
            </datalist>
        </nav>
        <nav className="align">
            <button className="" onClick={ () => false }>Left</button>
            <button className="" onClick={ () => false }>HCenter</button>
            <button className="" onClick={ () => false }>Right</button>
            <button className="" onClick={ () => false }>Top</button>
            <button className="" onClick={ () => false }>VCenter</button>
            <button className="" onClick={ () => false }>Bottom</button>
        </nav>

    </header>)
}

export default HeaderMenu