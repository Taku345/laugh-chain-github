import React, { useRef, Fragment } from 'react'
import { isString, urlHasPlaceholder } from "../../classes/util"
import { Dropdown, DropdownSide } from './Dropdown'
import { Link } from '@inertiajs/react'
import FlatMenus from './FlatMenus'
import { hasContext, firstHref } from './ContextMenusTop'

const DropdownMenusSide = ({
    parentKey = '',
    menus,
    child = 0,
    width=200,
}) =>
{
    const parentRef = useRef()

    return (<ul className={`${child == 0 ? 'DropdownMenus': 'child-' + child }`} ref={parentRef}>
    {Object.keys(menus).map((key) => {
        return (<Fragment key={key}>
        {isString(menus[key]) && (<>
            {!urlHasPlaceholder(menus[key]) && (
            <li>
                <Dropdown label={<Link href={menus[key]}>{key}</Link>} id={parentKey + key} parentRef={parentRef} />
            </li>)}
        </>) || (
            <li>
                {(hasContext(menus[key]) && !isString(menus[key])) && (<>
                    <span className='label'>{key}</span>
                    <FlatMenus menus={menus[key]} child={1} />
                </>) || (
                    <Link href={firstHref(menus[key])}>{key}</Link>
                )}
                {/* TODO: そのうち階層化
                <DropdownSide label={key} id={parentKey + key} parentRef={parentRef} width={width}>
                    <DropdownMenusSide
                        parentKey={key}
                        menus={menus[key]}
                        child={child+1}
                        width={width}
                    />
                </DropdownSide>
                */}
            </li>
        )}
        </Fragment>)
    })}
    </ul>)
}
export default DropdownMenusSide