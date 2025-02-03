import 'blu/sass/blu.scss';

import React, { useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/react';
import { FlashMessage } from 'blu/App';
import { DropdownProvider } from 'blu/Laravel/Layout/Dropdown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Dropdown from '@/OriginalComponents/Dropdown';
import DropdownContextMenuTop from "blu/Laravel/Layout/FlatMenus"
import { menus } from './admin-menus';

declare var route



const SideMenuLayout = ({
    auth = null,
    title = '',
    width=200,
    datetime,
    children
}) =>
{

    FlashMessage()

    const [ open, setOpen ] = useState(true)

    console.log(usePage())
    return (<div className={`TopMenuLayout`}>
        <Head title={title} />

        <DropdownProvider>
            <header className='layout-header'>
                <div className='top'>
                <h1>{title}</h1>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    {auth.user.name} {usePage().props.datetime}

                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Attribute
                                text={auth.user.public_key}
                                label={`Public Key`}
                            />
                            <Dropdown.Attribute
                                text={auth.user.address}
                                label={`Address`}
                            />
                            <Dropdown.Link
                                href={route('admin.profile.edit')}
                            >
                                Edit Account
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
                <nav className='menus'>
                    {<DropdownContextMenuTop menus={menus} />}
                </nav>
            </header>

            <main>
                {children}
            </main>

        </DropdownProvider>
    </div>)
}

export default SideMenuLayout
