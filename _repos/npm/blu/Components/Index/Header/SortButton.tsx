import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SortButton = ({
    orderBy,
    searchParams,
    setSearchParams,
    children,
    multipleOrder = false,
}) =>
{

    const setOrder = (order) =>
    {
        const newSearchParams = {...searchParams}

        if (multipleOrder)
        {
            // TODO:
        }
        else
        {
            if (order)
            {
                newSearchParams.orderBy = orderBy
                newSearchParams.order = order
            }
            else
            {
                if ('orderBy' in newSearchParams) delete newSearchParams.orderBy
                if ('order' in newSearchParams) delete newSearchParams.order
            }
        }

        setSearchParams(newSearchParams)
    }

    const order = 'orderBy' in searchParams && searchParams.orderBy == orderBy ? searchParams.order: ''

    return (<button
        className={`SortButton icon-button ${order} button small outline`}
        onClick={() => {
            switch (order)
            {
            case 'asc':
                setOrder('desc');
                break;
            case 'desc':
                setOrder(false);
                break;
            default:
                setOrder('asc');
                break
            }
        }}
    >
        {children}
        {!order && (<UnfoldMoreIcon className='icon deactive' />)}
        {order == 'desc'  && (<ExpandLessIcon className='icon' />)}
        {order == 'asc' && (<ExpandMoreIcon className='icon' />)}
    </button>)
}

export default SortButton