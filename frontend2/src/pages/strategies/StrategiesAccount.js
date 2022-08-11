import {ArrowRightIcon} from "@heroicons/react/solid";
import AuthContext from "../../context/AuthContext";
import useAxios from "../../utils/useAxsios";
import {useContext, useEffect, useState} from "react"
import {
    LightningBoltIcon, CashIcon, CollectionIcon, GlobeIcon, CogIcon, BeakerIcon, CheckIcon
} from "@heroicons/react/outline";
import {StrategiesResults} from "./StrategiesResults";

export const StrategiesAccount = () => {
    const {authTokens, logoutUser, user} = useContext(AuthContext)
    const api = useAxios()

    const [userStrategies, setUserStrategies] = useState([])
    const [selectedStrategy, setSelectedStrategy] = useState("")
    const [strategyAction, setStrategyAction] = useState("")
    const [loadingContent, setLoadingContent] = useState(false)
    const [strategyData, setStrategyData] = useState([])

    const [efficiencyTracker, setEfficiencyTracker] = useState(true)
    const [boundlessCapital, setBoundlessCapital] = useState(true)
    const [takeProfit, setTakeProfit] = useState(0)
    const [stopLoss, setStopLoss] = useState(0)
    const [period, setPeriod] = useState("")
    const [interval, setInterval] = useState("")
    const [settingsConfirmed, setSettingsConfirmed] = useState(false)
    const [selectedWatchlist, setSelectedWatchlist] = useState([])
    const [selectedData, setSelectedData] = useState({})
    const [nShares, setNShares] = useState(1)
    const [entryStopLoss, setEntryStopLoss] = useState(0)
    const [entryTakeProfit, setEntryTakeProfit] = useState(0)
    const [capital, setCapital] = useState(0)
    const [isLoadingStrategyResults, setIsLoadingStrategyResults] = useState(false)


    const [strategyResults, setStrategyResults] = useState()


    const getUserStrategies = async () => {
        const response = await api.get(`/api/get-strategies/`)
        if (response.status === 200) {
            setUserStrategies(response.data)
        }
    }

    useEffect(() => {
        if (!userStrategies.length) {
            getUserStrategies()
        }
        console.log(selectedWatchlist)
    }, [strategyData, settingsConfirmed, selectedWatchlist, selectedData, isLoadingStrategyResults, strategyResults])


    const getStrategyData = async (endpoint) => {
        const response = await api.get(`/api/${endpoint}`)
        setLoadingContent(true)
        if (response.data) {
            setStrategyData(response.data)
            setLoadingContent(false)
        }
    }


    const StrategiesTable = () => {
        return (
            <table className="table w-full text-center">
                <thead>
                <tr>
                    <th>Current Selection</th>
                    <th>Name</th>
                    <th>Efficiency</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {userStrategies.map((strategy, index) => {
                    return (
                        <tr key={index}
                            className={`cursor-pointer transition-colors duration-500 ease-out ${selectedStrategy === strategy.name ? "bg-primary" : "bg-base-100"}`}
                            onClick={() => {
                                setSelectedStrategy(strategy.name)
                                setSelectedData(strategy)

                            }}>
                            <th className={'bg-inherit border-none'}>
                                <label className={'flex justify-center items-center'}>
                                    <LightningBoltIcon
                                        className={`w-7 h-7 ${selectedStrategy === strategy.name ? "fill-amber-400" : ""}`}/>
                                </label>
                            </th>
                            <td className={'bg-inherit border-none'}>
                                <div className="font-bold">{strategy.name}</div>
                                <div
                                    className="text-sm opacity-50">{Object.keys(JSON.parse(strategy.strategy_data)).length > 1 ? "Relationships" : "Relationship"}: {Object.keys(JSON.parse(strategy.strategy_data)).length}</div>
                            </td>
                            <td className={'bg-inherit border-none'}>
                                <div className={'w-[100%] flex justify-center items-center'}>
                                    <span className="badge badge-ghost badge-md">{strategy.efficiency}%</span>
                                </div>
                            </td>
                            <th className={'bg-inherit border-none'}>
                                <button className="btn btn-secondary btn-xs">details</button>
                            </th>
                        </tr>

                    )
                })}

                </tbody>
            </table>

        )
    }

    const WatchlistStrategy = () => {
        return (<>

                <h1 className="text-5xl font-bold">Select a Watchlist</h1>
                {!loadingContent ? <table className="table w-full shadow-2xl text-center">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tickers</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {strategyData.map((strategy, index) => {
                        return (
                            <tr onClick={() => {
                                setSelectedStrategy(strategy.name)
                                setSelectedWatchlist(JSON.parse(strategy.tickers))
                                console.log(JSON.parse(strategy.tickers))

                            }} key={index}
                                className={`cursor-pointer ${selectedStrategy === strategy.name ? "bg-primary" : "bg-base-100"}`}>

                                <td className={'bg-inherit'}>
                                    <div className="font-bold">{strategy.name}</div>
                                </td>
                                <td className={'bg-inherit'}>
                                    {JSON.parse(strategy.tickers).length}
                                </td>
                                <th className={'bg-inherit'}>
                                    <button onClick={() => {
                                        // eslint-disable-next-line no-restricted-globals
                                        location.href = `watchlist/${strategy.id}`
                                    }}
                                            className="btn bg-teal-500 border-none hover:bg-teal-600 btn-sm">details
                                    </button>
                                </th>
                            </tr>
                        )
                    })}
                    </tbody>
                </table> : <p>Loading</p>}
            </>
        )
    }


    const StockStrategy = () => {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Stock</h1>
                        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        )
    }

    const IndexStrategy = () => {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Index</h1>
                        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        )
    }

    const StrategyActionMenu = () => {

        useEffect(() => {
        }, [strategyAction, loadingContent])

        return (
            !strategyAction ? <></> : strategyAction === 'watchlist' ? <WatchlistStrategy/>
                : strategyAction === "stock" ? <StockStrategy/> :
                    strategyAction === 'index' ? <IndexStrategy/> : <></>
        )
    }


    const NumericInput = ({getter, key, setter}) => {

        const [input, setInput] = useState("")
        const [confirmed, setConfirmed] = useState(!!getter)

        useEffect(() => {
        }, [input, confirmed])
        return (
            <div className={'flex gap-4 justify-end items-center'}>
                <input defaultValue={getter ? getter : ""} key={key} type="text"
                       className={`input input-bordered  ${confirmed ? "input-primary" : ""} w-[50%]`}
                       placeholder={'0'} onChange={(e) => {
                    if (!isNaN(e.target.value) && !(e.target.value === "")) {
                        setInput(e.target.value)

                    }
                }}/>
                <button className={'btn btn-primary btn-sm'} onClick={() => {
                    setConfirmed(true)
                    setter(input)
                }}><CheckIcon className={'w-5 h-5'}/></button>
            </div>
        )
    }

    const StrategySettings = () => {
        //
        //
        useEffect(() => {

        }, [settingsConfirmed, stopLoss, boundlessCapital, efficiencyTracker, period, interval])

        return (
            <div className={'flex gap-10 items-start'}>
                <div className={'indicator'}>
                    <span
                        className={`indicator-item badge badge-md indicator-top indicator-start transition-colors duration-500 font-bold ${settingsConfirmed ? "badge-success" : "badge-error"}`}>{settingsConfirmed ? "Confirmed" : "Untracked"}</span>
                    <div
                        className="shadow-2xl bg-base-200 rounded-box col-span-3 row-span-3 mx-2 flex w-72 flex-shrink-0 flex-col justify-center gap-4 p-4 shadow-xl xl:mx-0 xl:w-full svelte-1n6ue57">
                        <div className="px-6 pt-6">
                            <div className="text-xl font-extrabold">Trading Session Settings</div>
                            <div className="text-base-content/70 my-4 text-xs">Enable and set the parameters for the
                                current simulation
                            </div>
                            <div className="dropdown w-full flex-1">
                                <div tabIndex="0">
                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span className="label-text">Enable efficiency tracker</span>
                                        <input type="checkbox" className="toggle toggle-primary"
                                               defaultChecked={efficiencyTracker}
                                               onClick={() => setEfficiencyTracker(!efficiencyTracker)}/></label>
                                    </div>
                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span
                                        className="label-text">Boundless Capital</span>
                                        <input type="checkbox" className="toggle" defaultChecked={boundlessCapital}
                                               onClick={() => setBoundlessCapital(!boundlessCapital)}/></label></div>
                                    {!boundlessCapital ?
                                        <div className="form-control"><label
                                            className="label cursor-pointer">
                                            <div>
                                                <span className="label-text">Capital ($)</span>
                                                <div className={'text-sm opacity-50'}>Defaults to 0</div>
                                            </div>
                                            <NumericInput setter={setCapital} getter={capital} key={"Capital"}/>
                                        </label>
                                        </div> : <></>}

                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span
                                        className="label-text">Period</span>

                                        <select className="select select-bordered w-[65%]"
                                                onChange={(e) => setPeriod(e.target.value)}>
                                            <option disabled={true}>Pick a period</option>
                                            <option value={'1mo'} selected={period === '1mo'}>1 month</option>
                                            <option value={'3mo'} selected={period === '4mo'}>3 months</option>
                                            <option value={'6mo'} selected={period === '6mo'}>6 months</option>
                                            <option value={'1y'} selected={period === '1y'}>1 year</option>
                                            <option value={'2y'} selected={period === '2y'}>2 years</option>
                                            <option value={'5y'} selected={period === '5y'}>5 years</option>
                                            <option value={'10y'} selected={period === '10y'}>10 years</option>
                                        </select>

                                    </label>
                                    </div>
                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span
                                        className="label-text">Interval</span>
                                        <select className="select select-bordered w-[65%]" onChange={(e) => {
                                            setInterval(e.target.value)
                                        }}>
                                            <option disabled={true}>Pick an interval</option>
                                            <option value={'1m'} selected={interval === '1m'}>1 minute</option>
                                            <option value={'5m'} selected={interval === '5m'}>5 minutes</option>
                                            <option value={'1h'} selected={interval === '1h'}>hourly</option>
                                            <option value={'1d'} selected={interval === '1d'}>daily</option>
                                            <option value={'1w'} selected={interval === '1w'}>weekly</option>
                                        </select>

                                    </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="form-control">
                            <div className="dropdown dropdown-top dropdown-end">
                                <div tabIndex="0">
                                    <button onClick={() => {
                                        setSettingsConfirmed(true)
                                    }}
                                            className={`btn btn-block space-x-2 transition-colors duration-500 ease-out ${settingsConfirmed ? "btn-primary" : "btn-secondary"}`}>
                                        <CogIcon className={'w-6 h-6'}/>
                                        <span>Apply settings</span></button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className="h-max shadow-2xl bg-base-200 rounded-box col-span-3 row-span-3 mx-2 flex w-72 flex-shrink-0 flex-col justify-center gap-4 p-4 shadow-xl xl:mx-0 xl:w-full svelte-1n6ue57">
                        <div className="px-6 pt-6">
                            <div className="text-xl font-extrabold">Entry Point Settings</div>
                            <div className="text-base-content/70 my-4 text-xs">Enable and set the parameters for every
                                single entry point
                            </div>
                            <div className="dropdown w-full flex-1">
                                <div tabIndex="0">
                                    <div className="form-control"><label
                                        className="label cursor-pointer">
                                        <div>
                                            <span className="label-text">Shares</span>
                                            <div className={'text-sm opacity-50'}>Defaults to 1</div>
                                        </div>
                                        <NumericInput setter={setNShares} getter={nShares} key={"nShares"} default={1}/>
                                    </label>
                                    </div>
                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span
                                        className="label-text">Stop Loss (%)</span>
                                        <NumericInput setter={setEntryStopLoss} getter={entryStopLoss}
                                                      key={"stopLoss"}/>
                                    </label>
                                    </div>
                                    <div className="form-control"><label
                                        className="label cursor-pointer"><span
                                        className="label-text">Take Profit (%)</span>
                                        <NumericInput setter={setEntryTakeProfit} getter={entryTakeProfit}
                                                      key={"stopLoss"}/>
                                    </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="hero min-h-screen bg-current">
                <div className={'flex flex-col gap-40'}>

                    <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                        <div
                            className={`w-[100%]  ${Object.keys(selectedStrategy).length ? "flex flex-col gap-10" : ""}`}>
                            {userStrategies ? <StrategiesTable/> : <></>}
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-accent-content">Strategy Selection</h1>
                            <p className="py-6 text-accent-content">Select one of your strategies and apply it against
                                a <strong className={'font-bold'}>benchmark</strong> of your choice</p>
                        </div>
                    </div>
                    <div className={'relative'}>
                        {selectedStrategy ?
                            <div className={"absolute translate-x-[0%] flex gap-12 justify-center items-center"}>
                                <div className={'flex justify-center gap-12'}>
                                    <div className={'flex justify-around p-6 animation-first-appearance'}>
                                        <button onClick={
                                            () => {
                                                setStrategyAction("stock")
                                            }
                                        }
                                                className={'btn bg-purple-500 btn-lg hover:bg-purple-600 border-none'}>
                                            <div className={'flex gap-2 items-center'}>
                                                <span>Stock</span>
                                                <CashIcon className={'w-5 h-5'}/>
                                            </div>
                                        </button>
                                    </div>
                                    <div className={'flex justify-around p-6 animation-second-appearance'}>
                                        <button onClick={() => {
                                            setStrategyAction("watchlist")
                                            getStrategyData(`watchlists/`)
                                        }}
                                                className={'btn bg-amber-500 hover:bg-amber-600 border-none btn-lg'}>
                                            <div className={'flex gap-2 items-center'}>
                                                <span>Watchlist</span>
                                                <CollectionIcon className={'w-5 h-5'}/>
                                            </div>
                                        </button>
                                    </div>
                                    <div className={'flex justify-around p-6 animation-third-appearance'}>
                                        <button onClick={() => setStrategyAction("index")}
                                                className={'btn bg-pink-500 hover:bg-pink-600 border-none btn-lg'}>
                                            <div className={'flex gap-2 items-center'}>
                                                <span>Index</span>
                                                <GlobeIcon className={'w-5 h-5'}/>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={'flex flex-col gap-4 text-accent-content justify-center items-center animation-slide-to-left'}>
                                    <h1 className={'font-bold  text-4xl'}>Benchmark</h1>
                                    <p className={'p-6 text-center'}>Select the type of benchmark to use for the trading
                                        simulation</p>
                                </div>
                            </div> : <></>}
                    </div>
                </div>
            </div>
            {/*Second hero*/}
            <div>
                <div className="hero min-h-screen bg-base-100">
                    <div className="hero-content text-center">
                        <div className={'flex flex-col gap-20'}>
                            <div className={'flex gap-32 justify-center items-center'}>
                                <div className="max-w-md flex flex-col justify-center items-center gap-10">
                                    <StrategyActionMenu/>
                                </div>
                                <StrategySettings/>
                            </div>
                            <div className={'flex justify-center items-center'}>
                                <button onClick={async () => {
                                    setIsLoadingStrategyResults(true)
                                    const response = await api.post("/api/run-analysis/", {
                                        strategyData: selectedData,
                                        collection: selectedWatchlist,
                                        constraints: {
                                            period: period,
                                            interval: interval,
                                            stopLoss: stopLoss,
                                            takeProfit: takeProfit,
                                            boundlessCapital: boundlessCapital,
                                            efficiencyTracker: efficiencyTracker,
                                            capital: capital
                                        },
                                        entryConstraints: {
                                            stopLoss: entryStopLoss,
                                            takeProfit: entryTakeProfit,
                                            shares: nShares
                                        }

                                    })
                                    console.log({
                                        strategyData: selectedData,
                                        collection: selectedWatchlist,
                                        constraints: {
                                            period: period,
                                            interval: interval,
                                            stopLoss: stopLoss,
                                            takeProfit: takeProfit,
                                            boundlessCapital: boundlessCapital,
                                            efficiencyTracker: efficiencyTracker,
                                            capital: capital
                                        },
                                        entryConstraints: {
                                            stopLoss: entryStopLoss,
                                            takeProfit: entryTakeProfit,
                                            shares: nShares
                                        }

                                    })
                                    if (response.status === 200) {
                                        setIsLoadingStrategyResults(false)
                                        setStrategyResults(response.data)
                                        return response.data
                                    } else {
                                        return response.data
                                    }
                                }}
                                        className={'btn bg-indigo-500 border-none hover:bg-indigo-600'}>
                                    <div className={`flex gap-2 justify-center items-center`}>
                                        <p className={'font-bold'}>Run Strategy</p>
                                        {isLoadingStrategyResults ?
                                            <svg className={'w-6 h-6 animate-spin'} version="1.1" id="L9"
                                                 xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 100 100" enableBackground="new 0 0 0 0">
                                                <path fill="#fff"
                                                      d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path>
                                            </svg>
                                            : <BeakerIcon className={'w-6 h-6'}/>}
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {strategyResults ? <StrategiesResults strategyResults={strategyResults}/> : <></>}
        </>

    )
}