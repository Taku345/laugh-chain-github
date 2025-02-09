import { useEffect, useState } from "react"
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios"
import { usePage } from "@inertiajs/react";

declare var route

const VoteButton = ({
    district,
    candidate,
    initialRate = 0,
}) =>
{
    const auth: any = usePage().props.auth
    const laugh_chain_config: any = usePage().props.laugh_chain_config

    const [ rate, setRate ] = useState(initialRate)

    const useStore = useMutation(
        async (params: any) =>
        {
            const { data } = await axios.post(
                route('api.vote', {candidate: candidate.id}),
                params,
            )
            return data;
        },
        {
            onSuccess: (res) =>
            {
                console.log(res)
            },
            onError: (e: AxiosError) =>
            {
                alert(e.message)
            },
        }
    );

    const vote = () =>
    {
        setRate((before) => parseInt(before) + 1)
    }

    useEffect(() =>
    {
        let voteTimer = setTimeout(() =>
        {
            if (initialRate < rate)
            {
                useStore.mutate({ rate: rate })

            }

        }, 500)

        return () => clearTimeout(voteTimer)
    }, [ rate ])

    return (<>
        「{candidate.name}」

        {(auth.account && district.progress == laugh_chain_config.district.progress.voting) && (<>
            <button
                className='rounded bg-slate-600 text-white px-4 py-2'
                onClick={vote}
            >
                投票！「<span className={`${rate > 0 ? 'text-xl text-orange-200' : ''} `}>{rate}</span>」
            </button>
        </>) || (<>
            <button
                className='rounded bg-rose-600 text-white px-4 py-2'
            >
                終了！「<span className={`${rate > 0 ? 'text-xl text-orange-200' : ''} `}>{rate}</span>」
            </button>
        </>)}


    </>)
}

const Vote = ({
    district
}) =>
{
    return <>
        <ul className="text-sm flex flex-wrap">
            {district.candidate.map((candidate) => (<div className=" border rounded p-4 px-6 my-2 ml-1">
                <VoteButton
                    district={district}
                    candidate={candidate}
                    initialRate={candidate.my_vote_sum_rate ? candidate.my_vote_sum_rate : 0}
                />
            </div>))}
        </ul>
    </>
}

export default Vote