import { useState } from "react"
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios"
import { useForm, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { toastErrors } from "blu/Laravel/classes/useForm";

declare var route

const Candidacy = ({
    district
}) =>
{
    const auth: any = usePage().props.auth
    const laugh_chain_config: any = usePage().props.laugh_chain_config

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: '',
    });

    const send = (e) => {
        e.preventDefault();
        post(route('api.candidacy', {district: district.id}),
        {
            preserveScroll: true,
            onSuccess: (res) =>
            {
                setData({
                    name: '',
                })
                toast.success('立候補を送信しました。')
            },
            onError: (err) =>
            {
                toastErrors(errors)
            }
        });
    };

    const [ name, setName ] = useState('')
   
    const useStore = useMutation(
        async (params: any) =>
        {
            const { data } = await axios.post(
                route('api.candidacy', {district: district.id}),
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


    return <>
        <ul className="text-sm flex flex-wrap">
            {district.candidate.map((candidate) => (<div key={candidate.id} className=" border rounded p-4 px-6 my-2 ml-1">
                「{candidate.name}」
            </div>))}
        </ul>


        {(auth.account && district.progress == laugh_chain_config.district.progress.running) && (<>
            <input type="text" value={data.name} onChange={(e) => setData({ name: e.target.value})} size={100} className="w-full" />
            <button onClick={send} disabled={processing} className={` ${processing ? 'bg-slate:100': ''} rounded bg-slate-600 text-white font-bold py-2 px-10 my-2 text-lg`}>立候補</button>
            {errors.name && (<div className="text-red-500">{errors.name}</div>)}
        </>)}
    </>
}

export default Candidacy