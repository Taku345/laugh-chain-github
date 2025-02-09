import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import District from './District';
import Process from './Process';
import { Pusher, Echo } from '@/classes/echo';
import { Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';

declare var route

const Election = ({
    election
}) =>
{
    const queryClient = useQueryClient()
    useEffect(() =>
    {
        // channel
        console.log('channel create')
        // Echo.disconnect()
        // Echo.connect()
        Echo.leaveAllChannels()
        const echo = Echo.channel(`election-progress.${election.id}`).listen("ElectionProgressEvent", function (e) {
            toast.info(e.message)
            queryClient.invalidateQueries()
        });
    }, [])

    const { data, isLoading } = useQuery('election', async () =>
    {
        const { data } = await axios.get(route('api.election', {election: election.id}));
        return data;
    });

    console.log('data', data)


    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {election.name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex items-end">

{isLoading && (<div>Loading....</div>) || (<div className='w-3/5 mr-4'>
    {data.district.map((district, district_index)  => (
        <District
            key={district.id}
            index={district_index}
            district={district}
            forceClose={district_index < (data.district.length - 1)}
        />
    ))}
</div>)}

{isLoading && (<div>Loading....</div>) || (<div className="w-2/5 sticky border rounded p-2">
    {data.district.map((district, district_index)  => (<Fragment key={district.id}>
        {district_index}
        {district_index < (data.district.length - 1) && (
            <Process key={district.id} district={district} />
        )}
    </Fragment>))}
</div>)}



                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}


export default Election
