import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { isString } from '../../classes/util';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import isEqual from 'lodash.isequal'

export const toastErrors = (errors, max = 5) =>
{
    if (max < 1) return 0

    if (isString(errors))
    {
        toast.error(errors)
        max = max - 1
    }
    else
    {
        Object.keys(errors).map((errorKey) => {
            max = toastErrors(errors[errorKey], max)
        })
    }

    return max
}


const useForm = (item) =>
{
    // post put した後に data を最新のものに常に更新する
    const props = inertiaUseForm(item)

    useEffect( () =>
    {
        if (props.recentlySuccessful)
        {
            props.setData(item)
        }
    }, [props.recentlySuccessful])

    props.isDirty = !isEqual(item, props.data)

    return props
}

export default useForm;