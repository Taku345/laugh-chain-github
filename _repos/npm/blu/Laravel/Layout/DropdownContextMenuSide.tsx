import React, { useRef, Fragment } from 'react'
import { isString, urlHasPlaceholder } from "../../classes/util"
import { Dropdown, DropdownSide } from './Dropdown'
import FlatMenus from './FlatMenus'
import DropdownMenusSide from './DropdownMenusSide'
import { hasContext, firstHref } from './ContextMenusTop'
import { Link } from '@inertiajs/react'

const DropdownContextMenuSide = ({
    parentKey = '',
    menus,
    child = 0,
    width=200,
}) =>
{
    const parentRef = useRef()

    return (<div className={` ContextMenus DropdownContextMenusSide`}>
        <ul className={`${child == 0 ? 'DropdownMenus': 'child-' + child } top-menus`}>
            {Object.keys(menus).map((key) => {
                return (<Fragment key={key}>
                {isString(menus[key]) && (<>
                    {!urlHasPlaceholder(menus[key]) && (<li>
                        <Link href={menus[key]}>{key}</Link>
                    </li>)}
                </>) || (
                    <li>
                        {(hasContext(menus[key]) && !isString(menus[key])) && (<>
                            <span className='label'>{key}</span>
                            <FlatMenus menus={menus[key]} child={1} />
                        </>) || (<>
                            <DropdownSide label={key} id={parentKey + key} parentRef={parentRef} width={width}>
                                <DropdownMenusSide
                                    parentKey={key}
                                    menus={menus[key]}
                                    child={child+1}
                                    width={width}
                                />
                            </DropdownSide>
                        </>)}
                    </li>
                )}
                </Fragment>)
            })}
        </ul>
    </div>)
}
export default DropdownContextMenuSide