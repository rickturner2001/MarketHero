import {
    CalculatorIcon,
    ChartBarIcon, ChevronDownIcon,
    CollectionIcon,
    PencilIcon,
    PlusIcon,
    TrendingUpIcon,
} from "@heroicons/react/outline";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export const Dashboard = () => {

    const EfficiencyBarTracker = () => {
        return (
            <Bar options={{
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false
                    }
                },

            }} data={
                {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            data: [60, 55, 50, 65, 70, 75, 60],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                        }
                    ]


                }
            }/>
        )
    }

    return (

        <div >
            <div className={'flex justify-between'}>
                <div className={'flex flex-col gap-2'}>
                    <h1 className={' text-3xl font-extrabold'}>Dashboard</h1>
                    <p className={'opacity-70 '}>Organize your watchlists and strategies</p>
                </div>
                <div className={'flex gap-6'}>
                    <button className={'btn bg-white border-none'}>
                        <div className={'flex gap-2 justify-between items-center flex-row-reverse'}>
                            <p className={'text-indigo-500 text-sm'}>Edit Dashboard</p>
                            <PencilIcon className={'w-5 h-5 stroke-indigo-500'}/>
                        </div>
                    </button>
                    <button className={'btn bg-indigo-500 border-none'}>
                        <div className={'flex gap-2 justify-between items-center flex-row-reverse'}>
                            <p className={'text-accent-content text-sm'}>New Strategy</p>
                            <PlusIcon className={'w-5 h-5 stroke-white'}/>
                        </div>
                    </button>
                </div>

            </div>
            <div className={'dashboard-grid h-full mt-10 gap-x-20 gap-y-20'}>
                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-indigo-100 ml-10 p-5 rounded-full'}>
                            <CollectionIcon className={'w-5 h-5 stroke-indigo-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>3</h3>
                            <p className={'opacity-70'}>Watchlists</p>
                        </div>
                    </div>
                </div>
                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-green-100 ml-10 p-5 rounded-full'}>
                            <TrendingUpIcon className={'w-5 h-5 stroke-green-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>10</h3>
                            <p className={'opacity-70'}>Strategies</p>
                        </div>
                    </div>
                </div>

                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-rose-100 ml-10 p-5 rounded-full'}>
                            <ChartBarIcon className={'w-5 h-5 stroke-rose-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>60.5%</h3>
                            <p className={'opacity-70'}>Avg. Strategy Efficiency</p>
                        </div>
                    </div>
                </div>

                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-cyan-100 ml-10 p-5 rounded-full'}>
                            <CalculatorIcon className={'w-5 h-5 stroke-cyan-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>35</h3>
                            <p className={'opacity-70'}>Analyses</p>
                        </div>
                    </div>
                </div>

                <div
                    className={'bg-base-100 h-auto  w-full flex justify-start items-center rounded-md shadow-sm col-span-2  p-4'}>
                    <div className={'flex flex-col h-full w-full relative'}>
                        <h1 className={'text-lg mb-6 font-extrabold'}>Strategy Efficiency Tracker</h1>
                        <EfficiencyBarTracker/>
                    </div>
                </div>
                <div className={'bg-base-100 h-full w-full row-span-2 rounded-md'}>
                    <div className={'flex flex-col gap-20 p-6'}>
                        <div className={'flex justify-between '}>
                            <h2 className={'text-md font-semibold'}>My Strategies</h2>
                            <div className={'flex gap-2 justify-center items-center'}>
                                <p className={'text-sm opacity-60'}>Descending</p>
                                <ChevronDownIcon className={'w-4 h-4 opacity-60'}/>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-10 overflow-y-auto'}>

                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>10%</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 2</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>25%</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 3</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>40%</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 3</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>40%</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 3</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>40%</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 3</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>40%</p>
                                    </div>
                                </div>

                            </div>

                            <div className={'flex flex-col overflow-y-auto'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Strat 3</p>
                                        <p className={"text-xs opacity-70"}>3 Relationships</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>100%</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

                <div className={'bg-base-100 h-full w-full row-span-2 rounded-md'}>
                    <div className={'flex flex-col gap-20 p-6'}>
                        <div className={'flex justify-between '}>
                            <h2 className={'text-md font-semibold'}>My Watchlists</h2>
                            <div className={'flex gap-2 justify-center items-center'}>
                                <p className={'text-sm opacity-60'}>Stocks qty.</p>
                                <ChevronDownIcon className={'w-4 h-4 opacity-60'}/>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-10 overflow-y-auto'}>

                            <div className={'flex flex-col'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Watchlist</p>
                                        <p className={"text-xs opacity-70"}>10 Stocks</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>Industrials</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'flex flex-col'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Watchlist 2</p>
                                        <p className={"text-xs opacity-70"}>8 Stocks</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>Technology</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Watchlist 3</p>
                                        <p className={"text-xs opacity-70"}>7 Stocks</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>Healthcare</p>
                                    </div>
                                </div>

                            </div>
                            <div className={'flex flex-col'}>
                                <div className={'flex justify-between'}>

                                    <div className={'flex flex-col'}>
                                        <p className={'text-md'}>Random Watchlist 4</p>
                                        <p className={"text-xs opacity-70"}>5 Stocks</p>
                                    </div>
                                    <div>
                                        <p className={'text-md font-semibold'}>Technology</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-rose-100 ml-10 p-5 rounded-full'}>
                            <ChartBarIcon className={'w-5 h-5 stroke-rose-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>60.5%</h3>
                            <p className={'opacity-70'}>Avg. Strategy Efficiency</p>
                        </div>
                    </div>
                </div>
                <div
                    className={'bg-base-100 h-full w-full flex justify-start items-center rounded-md shadow-sm'}>
                    <div className={'flex gap-4 justify-center items-center'}>
                        <div className={'bg-rose-100 ml-10 p-5 rounded-full'}>
                            <ChartBarIcon className={'w-5 h-5 stroke-rose-600 '}/>
                        </div>
                        <div className={'flex flex-col'}>
                            <h3 className={'font-extrabold text-2xl'}>60.5%</h3>
                            <p className={'opacity-70'}>Avg. Strategy Efficiency</p>
                        </div>
                    </div>
                </div>


            </div>

        </div>


    )
}