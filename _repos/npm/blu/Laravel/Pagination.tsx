import { Fragment } from 'react'
import queryString from 'query-string'
import { Link } from '@inertiajs/react'

const Pagination = ({
    data,
    setSearchParams,
    isLoading,
    perPages=[10, 25, 50, 100, 250],
    add=2,
    firstLast = true,
    prevNext = true,
}) =>
{
	const pages = [];
    if (!isLoading)
    {
        const firstPageNum = Math.max(1, data.current_page - add              /* */ - Math.max(0, add - (data.last_page - data.current_page)));
        const lastPageNum  = Math.min(data.last_page, data.current_page + add /* */ + (add + (Math.max(1, data.current_page - add) - data.current_page)));

        for (let i = firstPageNum; i <= lastPageNum; i++)
        {
            pages.push(i);
        }

        if (!pages.includes(1) && !pages.includes(data.last_page))
        {
            pages.shift()
            pages.pop()
        }
    }

    const setPage = (e, url) =>
    {
        e.preventDefault();
        setSearchParams(queryString.parse(new URL(url).search, {arrayFormat: 'index'}))
    }

    return (<nav className="Pagination">
        <ul>
            {isLoading && (
                <li><span>Loading...</span></li>
            ) || (<>

                {prevNext && (<li className='prev'>
                    {data.prev_page_url && (
                        <Link onClick={(e) => setPage(e, data.prev_page_url)} href={data.prev_page_url}><span>&laquo;</span></Link>
                    ) || (
                        <span>&laquo;</span>
                    )}
                </li>)}

                {!pages.includes(1) && (<>
                    <li className="first">
                        {firstLast && (<Link onClick={(e) => setPage(e, data.first_page_url)} href={data.first_page_url}><span>1</span></Link>)}
                    </li>
                    {!pages.includes(2) && (
                        <li className={`dot ${(!pages.includes(1) && !pages.includes(data.last_page)) ? 'double': ''}`}>
                            <span className='dot'><span>…</span></span>
                        </li>
                    )}
                </>)}

                {data.links.map((link) => (<Fragment key={link.label}>
                    {pages.includes(parseInt(link.label)) && (
                    <li className={`${link.active ? 'active' : ''} ${link.url ? '' : 'disabled'}`} key={link.label}>
                    {link.url && (
                        <Link
                            href={link.url}
                            onClick={(e) => setPage(e, link.url)}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label}} />
                        </Link>
                    ) || (
                        <span dangerouslySetInnerHTML={{ __html: link.label}} />
                    )}
                    </li>
                    )}
                </Fragment>))}

                {!pages.includes(data.last_page) && (<>

                {!pages.includes(data.last_page - 1) && (
                    <li className={`dot ${(!pages.includes(1) && !pages.includes(data.last_page)) ? 'double': ''}`}>
                        <span className='dot'><span>…</span></span>
                    </li>
                )}
                <li className="last">
                    {firstLast && (<Link onClick={(e) => setPage(e, data.last_page_url)} href={data.last_page_url}><span>{data.last_page}</span></Link>)}
                </li>
                </>)}

                {prevNext && (<li className='next'>
                    {data.next_page_url && (
                        <Link onClick={(e) => setPage(e, data.next_page_url)} href={data.next_page_url}><span>&raquo;</span></Link>
                    ) || (
                        <span>&raquo;</span>
                    )}
                </li>)}

            </>)}
        </ul>

        <div>
            <span className="total"><small>Total: </small>{data?.total}<small>件</small></span>
            <select
                value={data?.per_page}
                onChange={(e) => {
                    e.preventDefault();
                    const newSearchParams = queryString.parse(new URL(data.first_page_url).search, {arrayFormat: 'index'})
                    if ('page' in newSearchParams) delete newSearchParams['page']
                    newSearchParams['perPage'] = e.target.value
                    setSearchParams(newSearchParams)
                }}
            >
            {perPages.map((perPage) => (
                <option value={perPage} key={perPage}>
                    {perPage}
                </option>
            ))}
            </select>
        </div>
    </nav>)
}

export default Pagination;
