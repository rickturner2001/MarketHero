import useAxios from "../utils/useAxsios";
import {useContext} from "react";
import AuthContext from "../context/AuthContext";
import {useEffect, useState} from "react";
import {SectorsSpreadChart} from "../components/charts/SectorsSpreadChart";
import {Table} from "../components/Table";
import {WatchlistNews} from "./watchlist_components/WatchlistNews";
import {ChartSquareBarIcon, ChevronDoubleRightIcon, LightningBoltIcon, PencilIcon} from "@heroicons/react/outline";
import {SearchIcon} from "@heroicons/react/solid";
import BarChart from "../components/charts/BarChart";
import LinePlot from "../components/charts/LinePlot";
import {createPortal} from "react-dom";
import {Modal} from "../components/Modal";
import {StrategiesMenu} from "../components/menus/StrategiesMenu";

export const WatchlistView = ({...other}) => {
    const watchlistId = other.match.params.id
    const {authTokens, logoutUser, user} = useContext(AuthContext)
    const api = useAxios()
    const [watchlistData, setWatchlistData] = useState()
    const [tickersData, setTickersData] = useState()
    const [news, setNewsData] = useState()
    const [analysisData, setAnalysisData] = useState()
    const [watchlistReturns, setWatchlistReturns] = useState()

    const getWatchlistData = async () => {
        const response = await api.get(`/api/get-watchlist/${watchlistId}`)
        if (response.status === 200) {
            setWatchlistData(response.data)
        }
    }

    const getTickersData = async () => {
        const response = await api.get(`/api/tickers-info/`)
        if (response.status === 200) {
            setTickersData(response.data)
        }
    }

    const getNewsData = async () => {
        const response = await api.get(`/api/get-news/32/`)
        if (response.status === 200) {
            setNewsData(response.data)
        }
    }
    const getWatchlistAnalysis = async () => {
        const response = await api.get(`/api/get-watchlist-analytics/${watchlistId}/`)
        if (response.status === 200) {
            setAnalysisData(response.data.data)
        }
    }

    const getWatchlistReturns = async () => {
        const response = await api.get(`/api/get-watchlist-returns/${watchlistId}/`)
        if (response.status === 200) {

            setWatchlistReturns(response.data)
        }
    }

    const ReturnsPlot = ({watchlistReturns}) => {
        return (
            <LinePlot data={{
                labels: watchlistReturns['data']['labels'],
                datasets: [
                    ...(Object.keys(watchlistReturns['data']['data']).map((ticker, index) => {
                        return {
                            label: ticker,
                            data: watchlistReturns['data']['data'][ticker],
                            borderColor: [
                                "#d63031", "#feca57", "#5f27cd", "#54a0ff", "#01a3a4",
                                "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
                                "#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#ffeaa7",
                                "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
                                "#25CCF7", "#FD7272", "#54a0ff", "#00d2d3",
                                "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
                                "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
                                "#55efc4", "#81ecec", "#74b9ff", "#a29bfe", "#dfe6e9",
                                "#fab1a0", "#ff7675", "#fd79a8", "#fdcb6e", "#e17055",
                            ]
                        }
                    }))
                ]
            }} text={"Watchlist Returns"}/>
        )
    }

    useEffect(() => {
        getWatchlistData()
        getTickersData()
        getWatchlistAnalysis()
        getWatchlistReturns()


    }, [])

    return (
        <>
            {watchlistReturns ?
                // <ReturnsPlot watchlistReturns={watchlistData}/>
                createPortal(
                    <Modal content={ <ReturnsPlot watchlistReturns={watchlistReturns}/>} id={"chart-modal"}/>
                    , document.getElementById('overlay-root'))
                : <></>}

            {createPortal(<Modal content={<StrategiesMenu/>} id={'strategies-menu'} fitContent={true}/>, document.getElementById("overlay-root"))}
        <div className={'flex flex-col'}>
            {watchlistData && tickersData ?
                <div className='flex flex-row-reverse justify-around items-center gap-16 px-20 py-20 '>


                    {/*Watchlist actions (TOOLBOX)*/}
                    <div className='flex gap-24 justify-center items-center'>
                        <div className='flex flex-col gap-10'>
                            <div
                                className="col-span-3 row-span-2 mx-2 grid w-72 flex-shrink-0 gap-4 xl:mx-0 xl:w-auto xl:place-self-stretch">
                                <div
                                    className="bg-base-100 text-base-content rounded-box shadow-xl bg-neutral text-accent-content">
                                    <div className="dropdown dropdown-end w-full">
                                        <div tabIndex="0">
                                            <ul className="menu overflow-visible p-3">
                                                <li>
                                                    <button className={'btn active:text-accent-content active:bg-primary justify-start'}>
                                                        <PencilIcon className={'w-6 h-6'}/>
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <label htmlFor={'strategies-menu'} className={'btn active:text-accent-content active:bg-primary justify-start'}>
                                                        <LightningBoltIcon className={'w-6 h-6'}/>
                                                        Strategies
                                                    </label>
                                                </li>
                                                <li>
                                                    <label htmlFor={'chart-modal'} className={`btn active:text-accent-content active:bg-primary ${watchlistReturns ? "" : "btn-disabled"}`}>
                                                        <ChartSquareBarIcon className={'w-6 h-6'}/>
                                                        Watchlist Returns
                                                        <div className="badge badge-primary">new</div></label>
                                                </li>
                                            </ul>
                                        </div>
                                        <div tabIndex="0" className="dropdown-content py-2">
                                            <div
                                                className="card compact bg-neutral-focus text-neutral-content rounded-box w-72 shadow-xl">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {watchlistData && analysisData ?
                                <div className='flex flex-col bg-blue-400 px-6 py-6 rounded-box w-[100%] h-full'>
                                    <h1 className='text-3xl font-bold text-white mb-12'>Portfolio Weights</h1>
                                    <div className="stats stats-vertical shadow bg-base-100 w-[100%]">
                                        {analysisData['optimal_weights'].map((weight, index) => {
                                            return (

                                                weight.toFixed(4) > 0 ? <div className="stat" key={index}>
                                                    <div
                                                        className="stat-title">{JSON.parse(watchlistData.tickers)[index]}</div>
                                                    <div className="stat-value">{weight.toFixed(3)}</div>
                                                </div> : <></>
                                            )
                                        })}
                                    </div>
                                </div> :
                                <div className='flex flex-col bg-base-300 px-6 py-6 rounded-box w-80 h-full'>
                                    <h1 className='text-3xl font-bold text-white mb-12'>Portfolio Weights</h1>
                                    <div className="stats stats-vertical shadow bg-base-100 w-[100%]">
                                        <div className="stat">
                                            <div className="flex justify-center">
                                                <div
                                                    className="stat-title animate-pulse bg-base-200 py-3 rounded-box mb-3 w-1/2"></div>
                                            </div>
                                            <div className="flex justify-center">
                                                <div
                                                    className="stat-title animate-pulse bg-base-200 py-3 rounded-box w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                        </div>

                        <div className='flex flex-col'>
                            <h1 className="text-5xl font-bold mb-10 text-center">{watchlistData.name}</h1>
                            <Table paginationvalue={10}
                                   tableData={[["Symbol", "Security", "Sector", "Industry"],
                                       JSON.parse(watchlistData.tickers).map((ticker) => {
                                           return [
                                               ticker,
                                               tickersData[ticker].security,
                                               tickersData[ticker].sector,
                                               tickersData[ticker].sub_industry,
                                           ]
                                       })]}/>
                        </div>

                        {analysisData ?


                            <div className='flex flex-col items-center gap-12 justify-center'>

                                <div className="stats bg-primary text-primary-content h-max overflow-visible w-[100%]">

                                    <div className="stat">
                                        <div className="stat-title">Alpha (SP500)</div>
                                        <div className="stat-value">{analysisData.alpha.toFixed(3)}</div>
                                        <div className="stat-actions">
                                            <button
                                                className={`btn btn-sm btn-${analysisData.alpha < 0 ? 'error' : 'success'} `}>Full
                                                value
                                            </button>
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-title">Beta (SP500)</div>
                                        <div className="stat-value">{analysisData.beta.toFixed(3)}</div>
                                        <div className="stat-actions">
                                            <button
                                                className={`btn btn-sm btn-${analysisData.beta < 0 ? 'warning' : 'success'} `}>Full
                                                value
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                <div className='flex flex-col gap-3 bg-base-300 px-6 py-4 rounded-box w-[100%]'>
                                    <h1 className={'text-3xl font-bold text-white'}>Compare to</h1>
                                    <div className="form-control">
                                        <div className="input-group">
                                            <input type="text" placeholder="Search…"
                                                   className="input input-bordered"/>
                                            <button className="btn btn-square btn-secondary">
                                                <SearchIcon className='w-6 h-6'/>
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </div>


                            :
                            <div className="stats bg-primary text-primary-content h-max overflow-visible w-[100%] w-80">

                                <div className="stat">
                                    <div className="animate-pulse stat-title bg-base-200 px-10 py-3 rounded-box"></div>
                                    <div
                                        className="animate-pulse stat-title  mt-4 px-4 py-6 bg-base-200 rounded-full"></div>
                                    <div className="stat-actions flex justify-center">
                                        <button
                                            className={`animate-pulse btn btn-sm btn stat-title bg-base-200 px-8`}>
                                        </button>
                                    </div>
                                </div>

                                <div className="stat">
                                    <div className="animate-pulse stat-title bg-base-200 px-10 py-3 rounded-box"></div>
                                    <div
                                        className="animate-pulse stat-title  mt-4 px-4 py-6 bg-base-200 rounded-full"></div>
                                    <div className="stat-actions flex justify-center">
                                        <button
                                            className={`animate-pulse btn btn-sm btn stat-title bg-base-200 px-8`}>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        }

                    </div>
                </div>
                :

                <></>}
        </div>
        </>



    );
}