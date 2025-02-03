import { Fragment } from 'react'
import { urlHasPlaceholder, isString } from "../../classes/util"
import { Dropdown } from './Dropdown'
import FlatMenus from './FlatMenus'
import { hasContext, firstHref } from './ContextMenusTop'
import { Link } from '@inertiajs/react'

const ContextMenusSide = ({
    parentKey = '',
    menus
}) =>
{

    return (<div className={`ContextMenus`}>
        <ul className='top-menus'>
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
                        </>) || (
                            <Link href={firstHref(menus[key])}>{key}</Link>
                        )}
                    </li>
                )}
                </Fragment>)
            })}
        </ul>
    </div>)
}
export default ContextMenusSide