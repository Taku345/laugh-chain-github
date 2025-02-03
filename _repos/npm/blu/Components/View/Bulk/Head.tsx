const Head = ({
    tag = 'table',
    config,
}) =>
{
    return (tag == 'table' && (
        <thead>
            <tr>
                {Object.keys(config).map((key) => (
                <th key={key}>
                    {config[key].label ?? key}
                </th>
                ))}
            </tr>
        </thead>
    ) || (
        <></>
    ))
}

export default Head