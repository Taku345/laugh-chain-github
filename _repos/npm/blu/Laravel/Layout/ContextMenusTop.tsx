import React from 'react'
import { isString, isNumberString, urlHasPlaceholder, isObject } from "../../classes/util"
import { Dropdown } from './Dropdown'
import FlatMenus from './FlatMenus'
import { Link } from '@inertiajs/react'

export const hasContext = (menuValue) => 
{
    const url = location.href.replace(location.search, '')
    if (isString(menuValue))
    {
        if (menuValue.indexOf('*') > 0)
        {
            // TODO: 本当は正規表現でやるべき
            const menuValueArr = menuValue.split('*')
            return menuValueArr.length == 1 ?
                url.startsWith(menuValueArr[0]) :
                url.startsWith(menuValueArr[0]) && url.endsWith(menuValueArr[menuValueArr.length - 1])
        }
        return url == menuValue
    }
    
    for (let key in menuValue)
    {
        if (hasContext(menuValue[key])) return true
    }

    return false
}

export const firstHref = (menuValue) =>
{
    for (let key in menuValue)
    {
        if (isObject(menuValue[key]) || Array.isArray(menuValue[key]))
        {
            const _firstHref =  firstHref(menuValue[key])
            if (_firstHref) return _firstHref
        }

        if (!urlHasPlaceholder(menuValue[key]))
        {
            return isObject(menuValue[key]) || Array.isArray(menuValue[key]) ? firstHref(menuValue[key]) :  menuValue[key]
        }
    }
}

const ContextMenusTop = ({
    parentKey = '',
    menus
}) =>
{
    return (<div className={`ContextMenus`}>
        <ul className='top-menus'>
            {Object.keys(menus).map((key) => {
                return (<>
                {isString(menus[key]) && (<>
                    {!urlHasPlaceholder(menus[key]) && (<li>
                        <Link href={menus[key]}>{key}</Link>
                    </li>)}
                </>) || (
                    <li>
                        {hasContext(menus[key]) && (
                            <span className='label'>{key}</span>
                        ) || (
                            <Link href={firstHref(menus[key])}>{key}</Link>
                        )}
                    </li>
                )}
                </>)
            })}
        </ul>
    
    {Object.keys(menus).map((key) => {
        return (<>
        {(hasContext(menus[key]) && !isString(menus[key]))&& (<div className='bottom-menus'>
            <FlatMenus menus={menus[key]} child={1}/>
        </div>)}
        </>)
    })}
    </div>)
}
export default ContextMenusTop