import React from 'react'
import { Head, Link } from '@inertiajs/react';
import { FlashMessage } from '../../App';
import Menus from './DropdownMenusTop'
import { DropdownProvider } from './Dropdown'
import Auth from './Auth'

const TopMenuLayout = ({
    auth = null,
    title = '',
    home = <></>,
    menus = <></>,
    className= '',
    children,
}) =>
{
    FlashMessage()

    return (<div className={`TopMenuLayout ${className}`}>

        <Head title={title} />

        <DropdownProvider>

            <header className='layout-header'>
                <div className='top'>
                    <div className='home'>{home}</div>
                    {auth && auth.user && (<Auth auth={auth} />)}
                </div>

                <nav className='menus'>
                    {menus}
                </nav>
            </header>

            <main>
                {children}
            </main>

        </DropdownProvider>
    </div>)
}

export default TopMenuLayout