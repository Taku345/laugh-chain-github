import { usePage } from "@inertiajs/react";
import Candidacy from "./District/Candidacy";
import Vote from "./District/Vote";
import Close from "./District/Close";

const DistrictComponent = ({
    district,
    forceClose = false
}) =>
{
    const laugh_chain_config: any = usePage().props.laugh_chain_config
    const district_progress = forceClose ? laugh_chain_config.district.progress.close : district.progress

    switch (district_progress)
    {
    case laugh_chain_config.district.progress.running:
    case laugh_chain_config.district.progress.ran:
        return <Candidacy district={district} />
    case laugh_chain_config.district.progress.voting:
    case laugh_chain_config.district.progress.voted:
        return <Vote district={district} />
    case laugh_chain_config.district.progress.close:
    default:
        return <Close district={district} />
    }
}

const District = (props) =>
{

    return <div className="District  my-10 border rounded p-2">
        {props.district.progress}
        <DistrictComponent {...props} />
    </div>
}

export default District