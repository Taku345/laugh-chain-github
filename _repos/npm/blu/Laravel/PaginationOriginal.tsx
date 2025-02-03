import queryString from 'query-string';

const PaginationOriginal = ({
    data,
    setSearchParams,
    isLoading,
    perPages=[10, 25, 50, 100, 250],
}) =>
{
    return (<nav className="Pagination">
        <ul>
            {isLoading && (
                <li><span>Loading...</span></li>
            ) || (<>
                {data.links.map((link) => (
                    <li className={`${link.active ? 'active' : ''} ${link.url ? '' : 'disabled'}`} key={link.label}>
                    {link.url && (
                        <a
                            href={link.url}
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchParams(queryString.parse(new URL(link.url).search, {arrayFormat: 'index'}))
                            }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label}} />
                        </a>
                    ) || (
                        <span dangerouslySetInnerHTML={{ __html: link.label}} />
                    )}
                    </li>
                ))}
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
                <option value={perPage}>
                    {perPage}
                </option>
            ))}
            </select>
        </div>
    </nav>)
}

export default PaginationOriginal;
