import { useEffect } from "react"
import { useBluContext } from '../App'

const confirmBeforeUnload = (isDirty) =>
{
    const { setConfirmBeforeunload } = useBluContext()
    useEffect(() => {
        if (setConfirmBeforeunload) setConfirmBeforeunload(isDirty)
    }, [isDirty])
}

export default confirmBeforeUnload