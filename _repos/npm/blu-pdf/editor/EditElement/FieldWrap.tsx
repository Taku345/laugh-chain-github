

const FieldWrap = ({
    label='',
    unit='',
    children
}) =>
{
    // TODO: util?
    const strLen = (str) =>
    {
        let len = 0;
        for (let i = 0; i < str.length; i++)
        {
            (str[i].match(/[ -~]/)) ? len += 1 : len += 2;
        }
        return len;
    }


    return (<div className=''>
        <label>
            <span className='label'>{label}</span>
            <span style={{
                display: 'inline-block',
                maxWidth: `calc(100% - ${strLen(unit)}em)`
            }}>
                {children}
            </span>
            {unit && unit !='' && (<span className='unit'>{unit}</span>)}
        </label>
    </div>)

}

export default FieldWrap