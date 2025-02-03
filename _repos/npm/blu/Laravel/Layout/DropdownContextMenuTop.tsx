import React, { useRef, Fragment } from 'react'
import { isString, urlHasPlaceholder } from "../../classes/util"
import { Dropdown, } from './Dropdown'
import DropdownMenusTop from './DropdownMenusTop'
import FlatMenus from './FlatMenus'
import { hasContext, firstHref } from './ContextMenusTop'
import { Link } from '@inertiajs/react'

const DropdownContextMenusTop = ({
    parentKey = '',
    menus,
    child = 0,
}) =>
{
    const parentRef = useRef()


    return (<div className={`ContextMenus DropdownContextMenusTop`}>
        <ul className='DropdownMenus top-menus'>
            {Object.keys(menus).map((key) => {
                return (<Fragment key={key}>
                {isString(menus[key]) && (<>
                    {!urlHasPlaceholder(menus[key]) && (<li>
                        <Dropdown label={<Link href={menus[key]}>{key}</Link>} id={parentKey + key} parentRef={parentRef} />
                    </li>)}
                </>) || (
                    <li>
                        <Dropdown label={key} id={parentKey + key} parentRef={parentRef}>
                            <DropdownMenusTop
                                parentKey={key}
                                menus={menus[key]}
                                child={child+1}
                            />
                        </Dropdown>
                    </li>
                )}
                </Fragment>)
            })}
        </ul>

        {Object.keys(menus).map((key) => {
        return (<Fragment key={key}>
        {(hasContext(menus[key]) && !isString(menus[key]))&& (<div className='bottom-menus'>
            <FlatMenus menus={menus[key]} child={1}/>
        </div>)}
        </Fragment>)
    })}

    </div>)
}
export default DropdownContextMenusTop