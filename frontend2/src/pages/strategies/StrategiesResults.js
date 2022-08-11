import {useEffect, useState} from "react";
import LinePlot from "../../components/charts/LinePlot";
import {Pie} from "react-chartjs-2";
import {
    Chart as ChartJS,

    Tooltip,
    Legend, ArcElement,
} from 'chart.js';
import {RegularTable} from "../../components/tables/RegularTable";
import {ReportsMenuTickers} from "../../components/menus/ReportsMenuTickers";
import {ReportMenuGeneralStrategy} from "../../components/menus/ReportMenuGeneralStrategy";


ChartJS.register(ArcElement, Tooltip, Legend);


export const StrategiesResults = ({strategyResults}) => {
    const strategyData = strategyResults.data

    const [selectedTicker, setSelectedTicker] = useState(Object.keys(strategyData.tickersData)[0])
    const [currentMenu, setCurrentMenu] = useState("general")

    useEffect(() =>{

    }, [currentMenu])

    return (
        <div className="hero min-h-screen bg-current py-20">
            <div className="hero-content text-center">
                <div className={'flex flex-col gap-40 justify-center items-center'}>

                    <div className={'flex flex-col gap-10 justify-center items-center'}>
                        <div className={'flex items-center'}>
                            <div className={'w-[60%] flex flex-col text-accent-content'}>
                                <h1 className={'text-2xl font-bold'}>Strategy Results</h1>
                                <p className={'p-6'}>Choose whether to visualize ticker-specific data or the strategy report</p>
                            </div>
                            <div className="tabs tabs-boxed h-max">
                                <a className={`tab ${currentMenu === 'general' ? "tab-active" : ""}`} onClick={() => setCurrentMenu("general")}>General</a>
                                <a className={`tab ${currentMenu === 'tickers' ? "tab-active" : ""}`} onClick={() => setCurrentMenu("tickers")}>Tickers</a>
                            </div>
                        </div>

                        {currentMenu === 'tickers' ? <ReportsMenuTickers selectedTicker={selectedTicker} setSelectedTicker={setSelectedTicker} strategyData={strategyData}/>
                         : <ReportMenuGeneralStrategy strategyData={strategyData}/>}
                        <div>

                        </div>
                    </div>
                </div>

                {/* flex-col */}

            </div>
        </div>
    )


}