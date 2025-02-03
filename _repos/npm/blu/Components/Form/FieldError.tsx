const FieldError = ({
    fieldErrors
}) => {

    if (typeof fieldErrors === "string")
    {
        fieldErrors = [fieldErrors]
    }

    if (Object.keys(fieldErrors).filter((key) => typeof fieldErrors[key] == "string").length < 1)
    {
        return <></>
    }

    return (<ul className="FieldErrors">
        {fieldErrors.map((error) => (
            <li key={error}>{error}</li>
        ))}
    </ul>)
}

export default FieldError