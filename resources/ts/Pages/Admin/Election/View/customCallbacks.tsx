const customCallbacks = (
    render,
    config,
    preference,
    data,
    fieldKey,
    fieldConfig,
    fieldData,
) => {
    return {
        'sampleCallback': () => {
            return (<div>sampleCallback</div>)
        }
    }
}

export default customCallbacks