const Process = ({
    district
}) =>
{
    const candidate = district.candidate.reduce((max, current) => {
        return current.vote_sum_rate > max.vote_sum_rate ? current : max;
    }, district.candidate[0]);

    return (<div className="">
        <div className="text-center text-red-800 font-bold">
            「{candidate?.name}」
        </div>
        <div className="text-lg text-center font-bold">
            ↓
        </div>
    </div>)
}

export default Process