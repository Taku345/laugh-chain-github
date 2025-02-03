import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react';
import { FlashMessage } from '../../App';
import { DropdownProvider } from './Dropdown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Auth from './Auth'

declare var route

const SideMenuLayout = ({
    auth = null,
    title = '',
    home = <></>,
    menus = <></>,
    width=200,
    className='',
    children
}) =>
{

    FlashMessage()

    const [ open, setOpen ] = useState(true)

    return (<div className={`SideMenuLayout ${className}`}>
        <Head title={title} />

        <DropdownProvider>

            <header className='layout-header' style={{ paddingLeft: open ? width + 'px' : 0 }}>
                <h1>{title}</h1>
                {auth && auth.user && (<Auth auth={auth} />)}
            </header>

            <aside className={`${open ? 'open': 'close' }`} style={{ width: open ? width + 'px' : 0  }}>

                <div className='top'>
                    <div className='home'>{home}</div>
                </div>

                <nav className='menus'>
                    {menus}
                </nav>

                <div className="open-close" onClick={() => setOpen(!open)} style={{ left: open ? width + 'px' : 0 }}>
                {open && (<ChevronLeftIcon />) || (<ChevronRightIcon />)}
                </div>
            </aside>

            <main style={{ paddingLeft: open ? width + 'px' : 0 }}>
                {children}
            </main>

        </DropdownProvider>
    </div>)
}

export default SideMenuLayout
