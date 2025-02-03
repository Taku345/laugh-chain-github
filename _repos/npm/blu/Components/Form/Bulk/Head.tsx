const Head = ({
    tag = 'table',
    config,
}) =>
{
    return (tag == 'table' && (
        <thead>
            <tr>
                {Object.keys(config).filter((key) => (config[key].type !== false && config[key].type != 'hidden')).map((key) => (
                <th key={key} className={key}>
                    {config[key].label ?? key}
                </th>
                ))}
                <th className='control'></th>
            </tr>
        </thead>
    ) || (
        <></>
    ))
}

export default Head