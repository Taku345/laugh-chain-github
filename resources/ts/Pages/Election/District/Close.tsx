const Close = ({
    district
}) =>
{

    const candidate = district.candidate.reduce((max, current) => {
        return (current.vote_sum_rate ? parseInt(current.vote_sum_rate): 0) > (max.vote_sum_rate ? parseInt(max.vote_sum_rate): 0) ? current : max;
    }, district.candidate[0]);

    return (<>
        <ul className="text-sm flex flex-wrap">
            {district.candidate.map((candidate) => (<div key={candidate.id} className="border rounded p-4 px-6 my-2 ml-1 text-gray-300">
                {candidate.name}「{candidate.my_vote_sum_rate ? candidate.my_vote_sum_rate : 0}/{candidate.vote_sum_rate ? candidate.vote_sum_rate : 0}」
            </div>))}
        </ul>
        <div className="text-lg text-center text-red-800 font-bold">
            {candidate?.name}
        </div>
    </>)

    return <></>
}

export default Close