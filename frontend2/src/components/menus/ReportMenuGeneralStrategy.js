import {RegularTable} from "../tables/RegularTable";
import LinePlot from "../charts/LinePlot";

export const ReportMenuGeneralStrategy = ({strategyData}) => {


    return (
        <div>
            <div>
                <div
                    className="col-span-3 row-span-3 mx-2 flex w-72 flex-shrink-0 flex-col xl:mx-0 xl:w-full rounded-box">
                    <div className="dropdown">
                        <div tabIndex="0" className="bg-opacity-100">
                            <div
                                className="tabs w-full bg-base-200 flex-grow-0 rounded-box rounded-br-none rounded-bl-none">
                                <button className={`tab tab-lifted tab-border-none tab-lg flex-1 tab-active`}>General
                                </button>
                            </div>
                        </div>

                    </div>
                    <div
                        className="bg-base-100 grid w-full flex-grow gap-3 rounded-xl rounded-tr-none  rounded-tl-none p-6 shadow-xl w-[60rem]">
                        <div className="flex items-center justify-center mb-2">
                            <div className={'text center'}>
                                <div className="text-lg font-extrabold">Strategy Data</div>
                                <div
                                    className="text-base-content/70 text-sm">{`${Object.keys(strategyData.tickersData).length} Tickers`}</div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <div tabIndex="0">
                                <div className="divider text-base-content/60 m-0">General Reports</div>
                            </div>

                        </div>
                        <div className="text-lg font-extrabold">Trades Report</div>
                        <div className="grid gap-3">
                            <div className="dropdown dropdown-top">
                                <div tabIndex="0">
                                    <div className="flex items-center p-1">
                                        <div className={'tooltip w-48'}
                                             data-tip={`${(strategyData.general['total_positive_entries'] / strategyData.general['total_entries'] * 100).toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Efficiency</span>
                                        </div>
                                        <progress max="100" className="progress progress-secondary"
                                                  value={(strategyData.general['total_positive_entries'] / strategyData.general['total_entries'] * 100).toFixed(2)}></progress>
                                        <span
                                            className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${(strategyData.general['total_positive_entries'] / strategyData.general['total_entries'] * 100).toFixed(2)}%`}</span>

                                    </div>
                                    <div className="flex items-center p-1">
                                        <div className={'tooltip w-48'}
                                             data-tip={`${strategyData.general['total_returns'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Total Return</span>
                                        </div>
                                        <progress max={Object.values(strategyData['tickersData'].length * 100)}
                                                  className="progress progress-info"
                                                  value={strategyData.general['total_returns'].toFixed(2)}></progress>
                                        <span
                                            className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.general['total_returns'].toFixed(2)}%`}</span>

                                    </div>
                                    <div className="flex items-center p-1">
                                        <div className={'tooltip w-48'}
                                             data-tip={`${strategyData.general['max_return'].toFixed(2)}%`}>
                                            <span className="text-base-content/70 text-xs">Best Entry</span>
                                        </div>

                                        <progress max='100' className="progress progress-primary"
                                                  value={`${strategyData.general['max_return'].toFixed(2)}`}></progress>
                                        <span
                                            className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.general['max_return'].toFixed(2)}%`}</span>

                                    </div>

                                    <div className="flex items-center p-1">
                                        <div className={'tooltip w-48'}
                                             data-tip={`${strategyData.general['min_return'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Worst Entry</span>
                                        </div>
                                        <progress max="100" className="progress progress-accent"
                                                  value={strategyData.general['min_return'].toFixed(2) * -1}></progress>
                                        <span
                                            className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.general['min_return'].toFixed(2)}%`}</span>
                                    </div>
                                    <div className="flex items-center p-1">
                                        <div className={'tooltip w-48'}
                                             data-tip={`${strategyData.general['average_average_return'].toFixed(2)}%`}>
                                                        <span
                                                            className="text-base-content/70  text-xs">Average Return</span>
                                        </div>
                                        <progress max="100" className="progress progress-warning"
                                                  value={strategyData.general['average_average_return'].toFixed(2)}></progress>
                                        <span
                                            className={'text-base-content/70 text-s font-bold ml-2 w-[5rem]'}>{`${strategyData.general['average_average_return'].toFixed(2)}%`}</span>

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
                                                ["Total Entries", `${strategyData.general['total_entries']}`],
                                                ["Positive", strategyData.general['total_positive_entries']],
                                                ["Negative", strategyData.general['total_negative_entries']],
                                            ]
                                        } tableHeads={['Label', "Value"]} hasHeaderCol={true}/>
                                    </div>

                                    <div className="rounded-box">
                                        <RegularTable className={"shadow-md"} tableRows={
                                            [["Return", `${strategyData.general['total_returns'].toFixed(2)} %`],
                                                ["Best Entry", `${strategyData.general['max_return'].toFixed(2)} %`],
                                                ["Worst Entry", `${strategyData.general['min_return'].toFixed(2)}%`],
                                            ]
                                        } tableHeads={['Label', "Value"]} hasHeaderCol={true}/>
                                    </div>
                                    <div className={'rounded-box'}>
                                        <RegularTable className={'shadow-md'} tableRows={
                                            [
                                                ["Average Return", `${strategyData.general['average_average_return'].toFixed(2)}`],
                                                ["Average Return Volatility", `${strategyData.general['average_return_volatility'].toFixed(2)}`],
                                                ["Efficiency", `${(strategyData.general['total_positive_entries'] / strategyData.general['total_entries'] * 100).toFixed(2)}%`],
                                            ]
                                        } tableHeads={["Label", "Value"]} hasHeaderCol={true}/>

                                    </div>
                                </div>
                                <div tabIndex="1" className={'mt-10 mb-10'}>
                                    <div className="divider text-base-content/60 m-0">Portfolio hisotry</div>
                                </div>
                                <div className={'bg-base-100 rounded-box p-4 relative shadow-2xl'}>
                                    <LinePlot text={`Portfolio Entries`} data={{
                                        labels: strategyData.general['portfolio_movements'].map((data) => {
                                            const [date, return_] = data
                                            return date
                                        }),
                                        datasets: [

                                            {
                                                label: "Cumulative Returns",
                                                data: strategyData.general['portfolio_movements'].map((data) => {
                                                    const [date, return_] = data
                                                    return return_
                                                }),
                                                borderColor: "rgba(55, 124, 251, 0.8)"
                                            },
                                        ]
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}