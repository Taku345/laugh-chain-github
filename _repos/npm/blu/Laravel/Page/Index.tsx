import React from 'react'
import useSearch from "../classes/useSearch"
import Pagination from "../Pagination"
import SearchFields from "../../Components/Index/SearchFields"
import Table from "../../Components/Index/Table"
import { OpenSearchPreferenceSetting, OpenIndexPreferenceSetting } from '../../Components/Preference/Setting'
import { ViewContextProvider } from 'blu/Components/View/Fields'

const Index = ({
    config,
    searchPreference = null,
    indexPreference = null,
    title='',
    apiUrl='',
    customCells = {},
    replaceState=true,
    forceCustomrCells=true,
    callbacks={},
}) =>
{
    const { searchParams, setSearchParams, results } = useSearch({
        apiUrl: apiUrl,
        replaceState: replaceState,
    })

    const configForIndex = {...config, ...customCells}
    if (forceCustomrCells)
    {
        Object.keys(customCells).map((key)=> {
            const newCustomCell = {...configForIndex[key]}
            newCustomCell.label = ('label' in configForIndex[key] ? configForIndex[key].label : key) + '(*)'
            configForIndex[key] = newCustomCell
        })
    }

    return (<>
        <section className='search'>
            <header>
                <h1>{title} - 検索</h1>
                {(searchPreference && 'preference' in searchPreference) && (
                <OpenSearchPreferenceSetting
                    config={config}
                    preference={searchPreference.preference}
                    setPreference={searchPreference.storePreference}
                    deletePreference={searchPreference.deletePreference}
                />)}
            </header>
            <div className="content">
                <SearchFields
                    config={config}
                    data={searchParams}
                    setData={setSearchParams}
                    preference={searchPreference && 'preference' in searchPreference ?
                        searchPreference.preference :
                        Array.isArray(searchPreference) ? searchPreference : []
                    }
                />
            </div>
        </section>


        <section className='index'>
            <header>
                <h1>{title} - 一覧</h1>
                {(indexPreference && 'preference' in indexPreference) && (
                <OpenIndexPreferenceSetting
                    config={configForIndex}
                    preference={indexPreference.preference}
                    setPreference={indexPreference.storePreference}
                    deletePreference={indexPreference.deletePreference}
                />)}
            </header>

            <div className='content'>
                <Pagination
                    data={results.data}
                    setSearchParams={setSearchParams}
                    isLoading={results.isLoading}
                />
                <ViewContextProvider
                    callbacks={callbacks}
                >
                    <Table
                        config={configForIndex}
                        preference={indexPreference && 'preference' in indexPreference ?
                            indexPreference.preference :
                            Array.isArray(indexPreference) ? indexPreference : []
                        }
                        isLoading={results.isLoading}
                        data={results.data?.data}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        customCells={customCells}
                        forceCustomrCells={forceCustomrCells}
                    />
                </ViewContextProvider>

                <Pagination
                    data={results.data}
                    setSearchParams={setSearchParams}
                    isLoading={results.isLoading}
                />
            </div>
        </section>
    </>)

}
export default Index