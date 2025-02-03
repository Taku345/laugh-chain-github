import { Fragment } from 'react'
import { urlHasPlaceholder, isString } from "../../classes/util"
import { Dropdown } from './Dropdown'
import { Link } from '@inertiajs/react'

const FlatMenus = ({
    menus,
    child = 0,
}) =>
{
    return (<ul className={`${child == 0 ? 'FlatMenus': 'child-' + child }`}>
    {Object.keys(menus).map((key) => {
        return (<Fragment key={key}>
        {isString(menus[key]) && (<>
            {!urlHasPlaceholder(menus[key]) && (<li key={key}><Link href={menus[key]}>{key}</Link></li>)}
        </>) || (
            <li key={key}>
                <span className='label'>{key}</span>

                <FlatMenus
                    menus={menus[key]}
                    child={child+1}
                />
            </li>
        )}
        </Fragment>)
    })}
    </ul>)
}
export default FlatMenus