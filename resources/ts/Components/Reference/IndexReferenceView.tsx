import Preview from "./Components/Preview"

const IndexReferenceView = ({
    fieldKey,
    config,
    data,
}) =>
{
    const fieldConfig = config[fieldKey]

    return (<div className='IndexReference IndexReferenceView'>
        {/* preview */}
        <Preview
            config={config}
            fieldKey={fieldKey}
            data={data}
        />
    </div>)
}

export default IndexReferenceView