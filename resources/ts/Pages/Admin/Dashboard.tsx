import Layout from '@/Layouts/AdminLayoutTop';
import { Head } from '@inertiajs/react';

import { Pusher, Echo } from '@/classes/echo';
import { useEffect } from 'react';

const Dashboard = ({
    auth,
}) =>
{
    useEffect(() =>
    {
        Echo.channel("demo-channel").listen("MessageEvent", function (e) {
            console.log(e)
        });
    }, [])

    return (
        <Layout
            title='Dashboard'
            auth={auth}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard
