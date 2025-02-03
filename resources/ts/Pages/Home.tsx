import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Echo } from '@/classes/echo';
import { toast } from 'react-toastify';

declare var route

const Dashboard = ({
}) =>
{
    const queryClient = useQueryClient()
    useEffect(() =>
    {
        Echo.leaveAllChannels()
        Echo.channel(`election-progress`).listen("ElectionProgressEvent", function (e) {
            toast.info(e.message)
            queryClient.invalidateQueries()
        });
    }, [])

    const { data, isLoading } = useQuery('elections', async () =>
    {
        const { data } = await axios.get(route('api.elections'))
        return data;
    });

    console.log(data)

    return (
        <Layout
        >
            <Head title="Home" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className='p-8'>
                        {isLoading && (<>Loading...</>) || (<ul>
                            {data.data.map((election) => (<li className="text-lg mb-4">
                                <Link href={route('election', {election: election.id})} className="hover:underline">
                                    {election.name}
                                    <span className='ml-12 text-sm rounded bg-slate-300 px-4 py-1'>{election.status}</span>
                                </Link>
                            </li>))}
                        </ul>)}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}


export default Dashboard
