import {RegularTable} from "../tables/RegularTable";
import {useEffect, useState} from "react";
import LinePlot from "../charts/LinePlot";

export const ReportsMenuTickers = ({strategyData, selectedTicker, setSelectedTicker}) =>{

    const [currentPage, setCurrentPage] = useState(1)


    const ReturnsTable = () => {

        useEffect(() => {

        }, [selectedTicker, currentPage])

        const pagesStep = 5

        return (

            <table className="shadow-2xl table w-[30rem] text-center">
                <thead>
                <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Return</th>
                </tr>
                </thead>
                <tbody>
                {strategyData.tickersData[selectedTicker].returns.map((return_, i) => {
                    return (
                        currentPage === 1 ? i < currentPage * pagesStep ?
                            <tr>
                                <td>{i + 1}</td>
                                <td>{strategyData.tickersData[selectedTicker].exits[i]}</td>
                                <th>
                                    <div
                                        className={`badge  badge-lg w-[5rem] ${return_ > 0 ? "badge-primary" : "badge-accent"}`}>{return_.toFixed(2)}</div>
                                </th>
                            </tr> : <></> : i > (currentPage - 1) * pagesStep && i <= currentPage * pagesStep ?
                            <tr>
                                <td>{i + 1}</td>
                                <td>{strategyData.tickersData[selectedTicker].exits[i]}</td>
                                <th>
                                    <div
                                        className={`badge badge-lg w-[5rem] ${return_ > 0 ? "badge-primary" : "badge-accent"}`}>{return_.toFixed(2)}</div>
                                </th>
                            </tr> : <></>
                    )
                })}

                </tbody>
            </table>
        )
    }

    let positiveEntries = [strategyData.tickersData[selectedTicker].plotting.entryIndex.map((entry, i) => {
        if (strategyData.tickersData[selectedTicker]['returns'][i] > 0) {
            return entry
        }
        return false
    })]

    let negativeEntries = [strategyData.tickersData[selectedTicker].plotting.entryIndex.map((entry, i) => {
        if (strategyData.tickersData[selectedTicker]['returns'][i] < 0) {
            return entry
        }
        return false
    })]

    positiveEntries = positiveEntries[0].filter((value) => {
        return !!value
    })
    negativeEntries = negativeEntries[0].filter(value => !!value)

    const bubbleSetDataPositive = positiveEntries.map((loc) => {
        return {
            x: strategyData.tickersData[selectedTicker].plotting.index[loc],
            y: strategyData.tickersData[selectedTicker].plotting.closes[loc]
        }
    })

    const bubbleSetDataNegative = negativeEntries.map((loc) => {
        return {
            x: strategyData.tickersData[selectedTicker].plotting.index[loc],
            y: strategyData.tickersData[selectedTicker].plotting.closes[loc]
        }
    })


    return(
        <div>
            <div
                className="col-span-3 row-span-3 mx-2 flex w-72 flex-shrink-0 flex-col xl:mx-0 xl:w-full rounded-box">
                <div className="dropdown">
                    <div tabIndex="0" className="bg-opacity-100">
                        <div
                            className="tabs w-full bg-base-200 flex-grow-0 rounded-box rounded-br-none rounded-bl-none">
                            {Object.keys(strategyData.tickersData).map((ticker) => {
                                return (
                                    <button onClick={() => {
                                        setSelectedTicker(ticker)
                                    }}
                                            className={`tab tab-lifted tab-border-none tab-lg flex-1 ${selectedTicker === ticker ? "tab-active" : ""}`}>{ticker}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                </div>
                <div
                    className="bg-base-100 grid w-full flex-grow gap-3 rounded-xl rounded-tr-none  rounded-tl-none p-6 shadow-xl w-[60rem]">
                    <div className="flex items-center justify-center mb-2">
                        <div className={'text center'}>
                            <div className="text-lg font-extrabold">Tickers Data</div>
                            <div
                                className="text-base-content/70 text-sm">{`${Object.keys(strategyData.tickersData).length} Tickers`}</div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <div tabIndex="0">
                            <div className="divider text-base-content/60 m-0">Reports</div>
                        </div>

                    </div>
                    <div className="text-lg font-extrabold">Trades Report</div>
                    <div className="grid gap-3">
                        <div className="dropdown dropdown-top">
                            <div tabIndex="0">
                                <div className="flex items-center p-1">
                                    <div className={'tooltip w-48'}
                                         data-tip={`${(positiveEntries.length / strategyData.tickersData[selectedTicker].returns.length * 100).toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Efficiency</span>
                                    </div>
                                    <progress max="100" className="progress progress-secondary"
                                              value={(positiveEntries.length / strategyData.tickersData[selectedTicker].returns.length * 100).toFixed(2)}></progress>
                                    <span
                                        className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${(positiveEntries.length / strategyData.tickersData[selectedTicker].returns.length * 100).toFixed(2)}`}</span>

                                </div>
                                <div className="flex items-center p-1">
                                    <div className={'tooltip w-48'}
                                         data-tip={`${strategyData.tickersData[selectedTicker]['total_returns'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Total Return</span>
                                    </div>
                                    <progress max="100" className="progress progress-info"
                                              value={strategyData.tickersData[selectedTicker]['total_returns'].toFixed(2)}></progress>
                                    <span
                                        className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.tickersData[selectedTicker]['total_returns'].toFixed(2)}%`}</span>

                                </div>
                                <div className="flex items-center p-1">
                                    <div className={'tooltip w-48'}
                                         data-tip={`${strategyData.tickersData[selectedTicker]['max_return'].toFixed(2)}%`}>
                                        <span className="text-base-content/70 text-xs">Best Entry</span>
                                    </div>

                                    <progress max='100' className="progress progress-primary"
                                              value={`${strategyData.tickersData[selectedTicker]['max_return'].toFixed(2)}`}></progress>
                                    <span
                                        className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.tickersData[selectedTicker]['max_return'].toFixed(2)}%`}</span>

                                </div>

                                <div className="flex items-center p-1">
                                    <div className={'tooltip w-48'}
                                         data-tip={`${strategyData.tickersData[selectedTicker]['min_return'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Worst Entry</span>
                                    </div>
                                    <progress max="100" className="progress progress-accent"
                                              value={strategyData.tickersData[selectedTicker]['min_return'].toFixed(2) * -1}></progress>
                                    <span
                                        className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.tickersData[selectedTicker]['min_return'].toFixed(2)}%`}</span>
                                </div>
                                <div className="flex items-center p-1">
                                    <div className={'tooltip w-48'}
                                         data-tip={`${strategyData.tickersData[selectedTicker]['average_return'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Average Return</span>
                                    </div>
                                    <progress max="100" className="progress progress-warning"
                                              value={strategyData.tickersData[selectedTicker]['average_return'].toFixed(2)}></progress>
                                    <span
                                        className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.tickersData[selectedTicker]['average_return'].toFixed(2)}%`}</span>

                                </div>
                            </div>
                            <div tabIndex="1" className={'mt-10'}>
                                <div className="divider text-base-content/60 m-0">Tabular Data</div>
                            </div>
                            <div
                                className={'flex  flex-row-reverse justify-around items-center mt-10 mb-10'}>
                                <div className="rounded-box ">
                                    <RegularTable className={"shadow-md"} tableRows={
                                        [
                                            ["Total Entries", `${strategyData.tickersData[selectedTicker]['returns'].length}`],
                                            ["Positive", positiveEntries.length],
                                            ["Negative", negativeEntries.length],
                                        ]
                                    } tableHeads={['Label', "Value"]} hasHeaderCol={true}/>
                                </div>

                                <div className="rounded-box">
                                    <RegularTable className={"shadow-md"} tableRows={
                                        [["Return", `${strategyData.tickersData[selectedTicker]['total_returns'].toFixed(2)} %`],
                                            ["Best Entry", `${strategyData.tickersData[selectedTicker]['max_return'].toFixed(2)} %`],
                                            ["Worst Entry", `${strategyData.tickersData[selectedTicker]['min_return'].toFixed(2)}%`],
                                        ]
                                    } tableHeads={['Label', "Value"]} hasHeaderCol={true}/>
                                </div>
                                <div className={'rounded-box'}>
                                    <RegularTable className={'shadow-md'} tableRows={
                                        [
                                            ["Average Return", `${strategyData.tickersData[selectedTicker]['average_return'].toFixed(2)}`],
                                            ["Returns Volatility", `${strategyData.tickersData[selectedTicker]['return_volatility'].toFixed(2)}`],
                                            ["Efficiency", `${(positiveEntries.length / strategyData.tickersData[selectedTicker].returns.length * 100).toFixed(2)}%`],
                                        ]
                                    } tableHeads={["Label", "Value"]} hasHeaderCol={true}/>

                                </div>
                            </div>
                            <div tabIndex="1" className={'mt-10 mb-10'}>
                                <div className="divider text-base-content/60 m-0">Entries Stats</div>
                            </div>
                            <div className={'flex justify-center items-center'}>
                                <div className={'flex flex-col gap-4 justify-center items-center'}>
                                    <ReturnsTable/>

                                    <div className="btn-group rounded-box">
                                        <button
                                            className={`btn  ${currentPage <= 1 ? "btn-disabled" : ""}`}
                                            onClick={() => {
                                                setCurrentPage(currentPage - 1)
                                            }}>«
                                        </button>
                                        <button className="btn">{currentPage}</button>
                                        <button className="btn "
                                                onClick={() => setCurrentPage(currentPage + 1)}>»
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div tabIndex="1" className={'mt-10 mb-10'}>
                                <div className="divider text-base-content/60 m-0">Ticker Movements</div>
                            </div>

                                 <div className={'bg-base-100 rounded-box p-4 relative shadow-2xl'}>
                            <LinePlot text={`${selectedTicker} Entries`} data={{
                            labels: strategyData['tickersData'][selectedTicker].plotting.index,
                            datasets: [

                                {
                                    label: "Price",
                                    data: strategyData['tickersData'][selectedTicker].plotting.closes,
                                    borderColor: "rgba(55, 124, 251, 0.8)"
                                },
                                {
                                    label: "Positive Returns",
                                    backgroundColor: "rgb(38, 166, 91)",
                                    borderColor: "rgb(38, 166, 91)",
                                    borderWidth: 1,
                                    radius: 5,
                                    type: "bubble",

                                    data: [
                                        ...bubbleSetDataPositive
                                    ]

                                },
                                {
                                    label: "Negative Returns",
                                    backgroundColor: "rgba(232, 82, 52, 0.6)",
                                    borderColor: "rgba(232, 82, 52, 0.6)",
                                    borderWidth: 1,
                                    radius: 5,
                                    type: "bubble",

                                    data: [
                                        ...bubbleSetDataNegative
                                    ]

                                }
                            ]
                        }}/>
                        </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
