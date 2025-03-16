import { usePage } from "@inertiajs/react";
import Candidacy from "./District/Candidacy";
import Vote from "./District/Vote";
import Close from "./District/Close";
import { useEffect, useState } from "react";


const TITLES = [
    '開始前',
    '立候補受付中',
    '立候補受付終了 - 投票開始待ち',
    '投票中',
    '投票終了',
    '終了',

]

const DistrictComponent = ({
    district,
    laugh_chain_config,
    district_progress,
    scene
}) =>
{
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

const District = ({
    index,
    district,
    forceClose = false
}) =>
{
    const laugh_chain_config: any = usePage().props.laugh_chain_config
    const district_progress = forceClose ? laugh_chain_config.district.progress.close : district.progress
    const [ remainingMs, setRemainingMs ] = useState(0)
    const scene = district.scene ? district.scene : ''



    useEffect(() =>
    {
        // if (timer) clearInterval(timer)
        const timer = setInterval(() =>
        {
            let remain_ms = 0
            Object.keys(laugh_chain_config.district.sec).map((key, index) =>
            {
                if (index <= district_progress)
                {
                    remain_ms += (laugh_chain_config.district.sec[key]) * 1000
                }
            })

            if (district_progress < 5)
            {
                console.log('remains', district_progress, remain_ms)
            }

            const remaining = new Date(district.created_at).getTime() + remain_ms - Date.now()
            if (remaining > 0)
            {
                setRemainingMs(Math.max(remaining, 0))
            }
        }, 100)

        return () => clearInterval(timer)
    }, [district_progress])

    // sceneをJSONとしてパース
    let parsedScene = scene;
    let isParsed = false;
    // console.log('scene:', scene)

    // コードブロックが含まれていれば、それを取り除く
    if (scene.includes('```json')) {
        // console.log('Trim')
        parsedScene = scene.match(/```json([\s\S]+?)```/)[1].trim();
    }

    try {
        if (scene.includes('scene')) {
            parsedScene = JSON.parse(parsedScene);
            // console.log('parsedScene:', parsedScene)
            isParsed = true;
        }
    } catch (error) {
        console.error('JSONのパースに失敗しました:', error);
    }

    return <div className="District  my-10 border rounded p-2">
        <h2>
            <span className="num">{index + 1}</span>:
            {TITLES[district_progress]}
        </h2>
        <h2>
            <br />
            {isParsed ? (
                <span>{parsedScene.scene.map((line, idx) => (<p key={idx}>{line}</p>))}</span>
            ) : (
                <span>{parsedScene}</span>
            )}
        </h2>
        {/* {(remainingMs /
        (laugh_chain_config.district.sec[Object.keys(laugh_chain_config.district.progress).find((key) => laugh_chain_config.district.progress[key] === district_progress )] * 1000))} */}
        <DistrictComponent
            district={district}
            laugh_chain_config={laugh_chain_config}
            district_progress={district_progress}
            scene={district.scene}
        />
    </div>
}

export default District