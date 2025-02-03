// 列の追加ぐらい
const Foot = ({
    tag = 'table',
    config,
    control,
}) =>
{
    const colSpan = Object.keys(config).filter((key) => (config[key].type !== false && config[key].type != 'hidden')).length + 1

    return (tag == 'table' && (
        <tfoot className="Foot">
            <tr>
                <th colSpan={colSpan}>
                    {control}
                </th>
            </tr>
        </tfoot>
    ) || (
        <div className="Foot">
            {control}
        </div>
    ))
}

export default Foot