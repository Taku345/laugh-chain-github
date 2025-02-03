import { useEffect } from "react"
import { useBluContext } from '../../App'

const confirmBeforeUnload = (isDirty) =>
{
    const { confirmBeforeunload, setConfirmBeforeunload } = useBluContext()

    useEffect(() => {
        if (setConfirmBeforeunload) setConfirmBeforeunload(isDirty)
    }, [isDirty])

    const confirmUnloadInertia = (e) =>
    {
        if (confirmBeforeunload && e.detail?.visit?.method == 'get')
        {
            if (! confirm('ページを移動してもよろしいですか？\n※編集中のものは保存されません'))
            {
                e.preventDefault()
            }
        }

        return true
    }

    useEffect(() => {
		document.addEventListener('inertia:before', confirmUnloadInertia)
        return () => {
			document.removeEventListener('inertia:before', confirmUnloadInertia)
        }
    }, [confirmBeforeunload])

}

export default confirmBeforeUnload