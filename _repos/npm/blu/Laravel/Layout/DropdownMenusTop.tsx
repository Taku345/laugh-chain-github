import React, { useRef, Fragment } from 'react'
import { isString, urlHasPlaceholder } from "../../classes/util"
import { Dropdown } from './Dropdown'
import { Link } from '@inertiajs/react'

const DropdownMenus = ({
    parentKey = '',
    menus,
    child = 0,
}) =>
{
    const parentRef = useRef()

    return (<ul className={`${child == 0 ? 'DropdownMenus': 'child-' + child }`} ref={parentRef}>
    {Object.keys(menus).map((key) => {
        return (<Fragment key={key}>
        {isString(menus[key]) && (<>
            {!urlHasPlaceholder(menus[key]) && (<li>
                <Dropdown label={<Link href={menus[key]}>{key}</Link>} id={parentKey + key} parentRef={parentRef} />
            </li>)}
        </>) || (
            <li>
                <Dropdown label={key} id={parentKey + key} parentRef={parentRef}>
                    <DropdownMenus
                        parentKey={key}
                        menus={menus[key]}
                        child={child+1}
                    />
                </Dropdown>
            </li>
        )}
        </Fragment>)
    })}
    </ul>)
}
export default DropdownMenus