import React from 'react'
import { Link } from '@inertiajs/react';
import { Dropdown } from './Dropdown'

declare var route

const Auth = ({ auth }) =>
{

    return (<div className='auth'>
        <Dropdown label={auth.user.name} id={'auth-user-name'}>
            <Link href={route('profile.edit')}>Profile</Link>
            <Link href={route('logout')} method="post" as="button">
                Log Out
            </Link>
        </Dropdown>
    </div>)
}

export default Auth