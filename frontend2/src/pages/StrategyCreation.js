import {
    ChevronDoubleUpIcon,

    LightBulbIcon, LightningBoltIcon,
    PencilIcon,
    PlusIcon, SwitchHorizontalIcon, TableIcon,
    TrashIcon
} from "@heroicons/react/outline";
import {useContext, useEffect, useState} from "react";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {createPortal} from "react-dom";
import * as PropTypes from "prop-types";
import {useHistory} from "react-router-dom"
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxsios";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const dummyChartingData = require("../assets/data/dummy_data.json")

export const StrategyCreation = () => {
    const [currentSubPlot, setCurrentSubplot] = useState("RSI")
    const [constraintsData, setConstraintsData] = useState([])

    const {authTokens, logoutUser, user} = useContext(AuthContext)
    const navigate = useHistory()
    const api = useAxios()

    useEffect(() => {



    }, [currentSubPlot])


    const DummyLinePlot = ({data}) => {

        return (
            <Line options={{
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function (val, index) {
                                return index % 10 === 0 ? this.getLabelForValue(val) : ""
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 1,
                        backgroundColor: "rgba(100, 99, 132, 0.5)"
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    title: {
                        display: false,
                    },
                },
            }} data={data}
            />
        )
    }

    const indicators = {

        RSI: {
            description: "Relative Strength Index",
            inputs: ["Period"],
            params: [14],
            subIndicators: false,
            isSub: true,
            columnNames: ["RSI"],
            show: true
        }, MACD: {
            description: "Moving average convergence divergence",
            inputs: ["Slow", "Fast", "Smoothing"],
            params: [26, 12, 9],
            subIndicators: ["MACD", "Signal", "Historgram"],
            isSub: true,
            columnNames: ["MACD_histogram"],
            show: true

        },

        MA: {
            description: "Moving Average",
            inputs: ["Period"],
            params: [50],
            isSub: false,
            subIndicators: false,
            columnNames: ["MA50"],
            show: true
        },

        Bollinger: {
            description: "Bollinger Bands",
            inputs: ['Period', "Std", "Offset"],
            params: [20, 2, 0],
            isSub: false,
            subIndicators: ["Lower Band", "Middle Band", "Upper Band"],
            columnNames: ["BB_lower", "BB_middle", "BB_upper"],
            show: true
        },

        Stochastic: {
            description: "Stochastic Oscillator",
            inputs: ["K Period", "D Period"],
            params: [14, 3],
            isSub: true,
            subIndicators: ["Stochastic K", "Stochastic D"],
            columnNames: ["STOCH_K", "STOCH_D"],
            show: true

        },

        Price: {
            description: "Closing Price", inputs: [], params: [], subIndicators: false, show: false
        }
    }


    const [fullIndicatorsData, setFullIndicatorsData] = useState(indicators)
    useEffect(() => {

    }, [fullIndicatorsData])

    const bgChartingColors = [
        ['rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.5)'],
        ['rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.5)'],
        ['rgb(255, 205, 86)', 'rgba(255, 205, 86, 0.5)']
    ]

    const additionalPlottingData = indicators[currentSubPlot].columnNames.map((colName, index) => {

        const [borderColor, backgroundColor] = bgChartingColors[index]

        return (
            {
                // borderWidth: 2,
                label: indicators[currentSubPlot].subIndicators[index] ? indicators[currentSubPlot].subIndicators[index] : currentSubPlot,
                data: dummyChartingData[colName],
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }
        )
    })


    const isNumeric = (str) => {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    const RequireNumericInput = ({setter, placeholder, getter, label}) => {


        return (
            <input className={'input input-bordered input-sm'} type={'text'} placeholder={placeholder}
                   onChange={(e) => {
                       if (isNumeric(e.target.value)) {
                           let currentAdditions = getter
                           currentAdditions[label] = e.target.value
                           setter(currentAdditions)
                       }
                   }}/>
        )
    }

    const GeneralInput = ({setter, placeholder, isNumericInput}) => {

        return (
            <input key={`input`} className={'input input-bordered w-full input-sm'} type={'text'}
                   placeholder={placeholder} onChange={(e) => {
                if (isNumericInput) {
                    if (isNumeric(e.target.value)) {
                        setter(e.target.value)
                    }

                }
                setter(e.target.value)
            }}/>
        )
    }


    const IndicatorMenu = () => {

        const [currentIndicator, setCurrentIndicator] = useState("")
        const [isCreating, setIsCreating] = useState(false)
        const [newAddition, setNewAddition] = useState({})
        const [indicatorName, setIndicatorName] = useState("")
        const [existingIndicator, setEditExistingIndicator] = useState(false)


        useEffect(() => {

        }, [currentIndicator, newAddition, indicatorName, isCreating, existingIndicator])


        return (
            <div className={'flex flex-col gap-8'} id={"indicatorMenu"}>
                <div className={'flex justify-between items-center'}>
                    <p className={'text-m font-bold'}>Personalize Indicators</p>
                    <button className={'btn  btn-sm bg-teal-500 border-none hover:bg-teal-600'}
                            onClick={() => setIsCreating(true)}>
                        <div className={' flex gap-2 justify-center items-center mr-2'}>
                            <PlusIcon className={'w-5 h-5'}/>
                            <p>New Indicator</p>
                        </div>
                    </button>

                </div>
                {existingIndicator ?
                    <div className={'flex flex-col gap-4 h-full'}>

                        <div className={'flex justify-center items-center w-full text-center'}>
                            <div className={'w-full'}>
                                <p className={'text-l font-extrabold'}>Parameters for {currentIndicator}</p>
                            </div>
                        </div>
                        {fullIndicatorsData[currentIndicator].inputs.map((param, index) => {
                            return (
                                <div className={'form-control gap-2'} key={index}>
                                    <label className={'text font-bold'}>{param}</label>
                                    <RequireNumericInput setter={setNewAddition} getter={newAddition}
                                                         placeholder={fullIndicatorsData[currentIndicator].params[index]}/>
                                </div>
                            )
                        })}

                        <div className={'flex w-full justify-center items-center'}>
                            <button onClick={() => {
                                setIsCreating(false)
                                setEditExistingIndicator(false)
                                let currentIndicatorsData = fullIndicatorsData
                                if (Object.keys(newAddition).length) {
                                    currentIndicatorsData[currentIndicator] = {
                                        description: indicators[currentIndicator].description,
                                        inputs: indicators[currentIndicator].inputs,
                                        params: Object.values(newAddition),
                                        isSub: indicators[currentIndicator].isSub,
                                        subIndicators: indicators[currentIndicator].subIndicators,
                                        columnNames: indicators[currentIndicator].columnNames,
                                        show: indicators[currentIndicator].show
                                    }
                                    setFullIndicatorsData(currentIndicatorsData)

                                }
                                setNewAddition({})
                                setCurrentIndicator("")
                            }
                            } className={'btn bg-teal-500 hover:bg-teal-600 border-none w-full shadow-md btn-sm'}>Add
                            </button>
                        </div>
                    </div>
                    : !isCreating ?
                        <div className={'flex flex-col gap-4 h-full'}>

                            {Object.keys(fullIndicatorsData).map((indicator, index) => {

                                return (
                                    fullIndicatorsData[indicator].show ?
                                        <div className={'flex justify-between items-center'} key={index}>
                                            <div className={'flex flex-col gap-2'}>
                                                <p className={'text-l font-bold'}>{indicator}</p>
                                                <p className={'text-sm opacity-70'}>{fullIndicatorsData[indicator].description}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => {
                                                    setEditExistingIndicator(true)
                                                    setCurrentIndicator(indicator)
                                                }} className={'btn btn-xs bg-amber-400 border-none hover:bg-amber-600'}>
                                                    <div className={'flex gap-2 justify-center items-center'}>
                                                        <PencilIcon className={'w-4 h-4'}/>
                                                        <p>Edit</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div> : <></>
                                )
                            })
                            }
                        </div> :
                        !currentIndicator ?
                            <div className={'flex flex-col justify-around'}>
                                <div className={'form-control gap-2'}>
                                    <label className={'text-sm font-bold'}>Indicator Type</label>
                                    <select className={'select select-bordered'}
                                            onChange={(e) => setCurrentIndicator(e.target.value)}>
                                        {Object.keys(indicators).map((indicator, index) => {
                                            return (
                                                indicators[indicator].show ?
                                                    <option key={index}
                                                            value={indicator}>{indicators[indicator].description}</option>

                                                    : <></>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div> :

                            <div className={'flex flex-col justify-between'}>
                                <div className={'flex flex-col gap-4'}>
                                    <div className={'form-control gap-2'}>
                                        <label className={'text-sm font-bold'}>Name</label>
                                        <GeneralInput setter={setIndicatorName}/>
                                    </div>
                                    {indicators[currentIndicator].inputs.map((param, index) => {
                                        return (
                                            <div className={'form-control gap-2'} key={index}>
                                                <label className={'text-sm font-bold'}>{param}</label>
                                                <RequireNumericInput setter={setNewAddition} getter={newAddition}
                                                                     label={param}/>
                                            </div>
                                        )
                                    })}

                                    <div className={'flex w-full justify-center items-center'}>
                                        <button onClick={() => {
                                            setIsCreating(false)
                                            let currentIndicatorsData = fullIndicatorsData
                                            currentIndicatorsData[indicatorName] = {
                                                description: indicators[currentIndicator].description,
                                                inputs: indicators[currentIndicator].inputs,
                                                params: Object.values(newAddition),
                                                isSub: indicators[currentIndicator].isSub,
                                                subIndicators: indicators[currentIndicator].subIndicators,
                                                columnNames: indicators[currentIndicator].columnNames,
                                                show: indicators[currentIndicator].show
                                            }
                                            setFullIndicatorsData(currentIndicatorsData)
                                            setIndicatorName("")
                                            setNewAddition({})
                                        }

                                        }
                                                className={'btn bg-teal-500 hover:bg-teal-600 border-none w-full shadow-md btn-sm'}>Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                }
            </div>
        )
    }

    const StrategyMenu = () => {
        const [firstVariable, setFirstVariable] = useState("")
        const [firstSubVariable, setFirstSubVariable] = useState("")
        const [secondVariable, setSecondVariable] = useState("")
        const [secondSubVariable, setSecondSubVariable] = useState("")
        const [relationship, setRelationship] = useState("")
        const [triggerValue, setTriggerValue] = useState(0)

        useEffect(() => {

        }, [firstVariable, firstSubVariable, secondSubVariable, secondVariable, relationship])

        const IndicatorSelection = ({label, setter, toMap, color, svgItem, getter}) => {
            return (
                <div key={"indicatorSelection"}
                     className={`bg-${color}-100 shadow-2xl h-full w-full p-4 flex justify-start items-center rounded-md shadow-sm border border-${color}-200 max-w-[18rem]`}>
                    <div className="flex gap-4 justify-center items-center">
                        <div className={`bg-${color}-100  p-5 rounded-full`}>
                            {svgItem}
                        </div>
                        <div className="flex flex-col"><label className="font-extrabold ">{label}</label>
                            <select defaultValue={getter ? getter : "first-value"} onChange={(e) => {
                                setter(e.target.value)
                            }} className={`select border-${color}-200`}>
                                <option value={'first-value'} disabled>Select value</option>
                                {toMap.map((el) => {
                                    return <option value={el}>{el.length <= 12 ? el : `${el.slice(0, 10)}...`}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={'flex flex-col h-full w-full'} key={"menuStrategy"}>
                <div className={'flex justify-between'}>
                    <div className={"flex flex-col gap-1"}>
                        <p className={'text-lg font-bold'}>Strategy Definition</p>
                        <p className={'text opacity-70'}>Choose the behavior of your strategy by defining
                            different
                            constraints</p>
                    </div>

                    <div className={'flex gap-2 '}></div>
                    <div className={'indicator mr-4 '}>
                        <span
                            className="indicator-item rounded-full badge badge-secondary">{constraintsData.length ? `+${constraintsData.length}` : constraintsData.length}</span>
                        <label htmlFor={'constraints-list'}
                               className={' ml-6 btn bg-teal-400 hover:bg-teal-600 border-none btn-sm modal-btn'}>
                           <div className={'flex gap-1 items-center'}>
                               <TableIcon className={'w-6 h-6'}/>
                            <p>List all</p>
                           </div>

                        </label>
                    </div>
                    <button onClick={() => {
                        if (firstVariable) {

                            let tempArray = []
                            tempArray.push(...constraintsData)
                            tempArray.push({
                                firstIndicator: firstVariable,
                                firstDescription: fullIndicatorsData[firstVariable].description,
                                subIndicator: firstSubVariable,
                                params: fullIndicatorsData[firstVariable].params,
                                relateTo: secondVariable === "Value" ? secondVariable : "Indicator",
                                secondIndicator: secondVariable,
                                selfRelatedValue: triggerValue,
                                relationshipType: relationship
                            })
                            setConstraintsData(tempArray)
                        } else {

                        }


                    }} className={'btn bg-cyan-400 hover:bg-cyan-500 border-none btn-sm'}>Add
                        Constraint
                    </button>
                </div>
                <div className={'flex justify-around items-center h-full'}>
                    <div className={'flex flex-col gap-6'}>
                        <IndicatorSelection label={"First Component"} setter={setFirstVariable}
                                            toMap={Object.keys(fullIndicatorsData)}
                                            svgItem={<LightBulbIcon className={`w-5 h-5 stroke-green-600`}/>
                                            } color={"green"} getter={firstVariable}/>
                        {firstVariable && fullIndicatorsData[firstVariable].subIndicators ?
                            <IndicatorSelection label={"Sub Indicator"}
                                                toMap={fullIndicatorsData[firstVariable].subIndicators}
                                                setter={setFirstSubVariable}
                                                svgItem={<ChevronDoubleUpIcon className={`w-5 h-5 stroke-teal-600`}/>
                                                } color={"teal"} getter={firstSubVariable}/> : <></>}
                    </div>

                    <div className={'flex flex-col gap-6'}>
                        <IndicatorSelection label={'Relationship'} toMap={["Greater than", "Equal to", "Less than"]}
                                            getter={relationship} setter={setRelationship} color={"indigo"}
                                            svgItem={<SwitchHorizontalIcon className={'w-5 h-5 stroke-indigo-600'}/>}/>
                    </div>

                    <div className={'flex flex-col gap-6'}>
                        <IndicatorSelection label={"Second Component"} setter={setSecondVariable}
                                            toMap={Object.keys(fullIndicatorsData).concat(['Value'])}
                                            svgItem={<LightBulbIcon className={`w-5 h-5 stroke-cyan-600`}/>
                                            } color={"cyan"} getter={secondVariable}/>
                        {secondVariable && secondVariable === "Value" ?
                            <div
                                className={`bg-teal-100 shadow-2xl h-full w-full p-4 flex justify-start items-center rounded-md shadow-sm border border-teal-200 max-w-[16rem]`}>
                                <div className="flex gap-4 justify-center items-center">
                                    <div className={`bg-teal-100  p-5 rounded-full`}>
                                        <LightningBoltIcon className={'w-5 h-5 stroke-teal-600'}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className={'font-bold'}>Trigger Value</label>
                                        <GeneralInput setter={setTriggerValue} isNumericInput={true}/>
                                    </div>
                                </div>
                            </div>
                            : secondVariable && fullIndicatorsData[secondVariable].subIndicators ?
                                <IndicatorSelection label={"Sub Indicator"}
                                                    toMap={fullIndicatorsData[secondVariable].subIndicators}
                                                    setter={setSecondSubVariable}
                                                    svgItem={<ChevronDoubleUpIcon
                                                        className={`w-5 h-5 stroke-teal-600`}/>
                                                    } color={"teal"} getter={secondSubVariable}/> : <></>}
                    </div>

                </div>
            </div>

        )
    }


    const ListAllConstraintsTable = () => {

        const [strategyName, setStrategyName] = useState("")

        useEffect(() =>{

        }, [strategyName])

        return (
            <>
                <input type="checkbox" id="constraints-list" className="modal-toggle"/>
                <div className="modal">
                    <div className="">
                        <div className={'w-max h-max relative bg-white p-10 rounded-box '}>

                            <div className={"flex justify-between mb-2"}>
                                <h2 className={'text-lg font-bold'}>Constraints Table</h2>
                                <div className={'form-control'}>
                                    <label className={'opacity-70 font-bold text-sm'}>Strategy Title</label>
                                    <GeneralInput setter={setStrategyName} placeholder={strategyName} isNumericInput={false}/>


                                </div>

                            </div>

                            <div className={'flex flex-col gap-6'}>
                                <table className="table w-max shadow-md text-center">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>First Variable</th>
                                        <th>SubIndicator</th>
                                        <th>Relationship</th>
                                        <th>Second Variable</th>
                                        <th>Second SubIndicator</th>
                                        <th>Trigger Value</th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {constraintsData.map((constraint, index) =>{
                                        return(
                                            <tr className={'hover font-bold text-sm '}>
                                                <th>{index + 1}</th>
                                                <td>{constraint.firstIndicator}</td>
                                                <td>{constraint.subIndicator ? constraint.subIndicator : "-"}</td>
                                                <td><span className={`p-3  rounded-box  ${constraint.relationshipType === "Greater than" ? "bg-green-100" : constraint.relationshipType === "Equal to" ? "bg-indigo-100" : "bg-red-100"}`}>{constraint.relationshipType}</span></td>
                                                <td>{constraint.secondIndicator === "Value" ? "-" : constraint.secondIndicator}</td>
                                                <td>{constraint.secondSubIndicator ? constraint.secondSubIndicator : "-"}</td>
                                                <td>{constraint.selfRelatedValue ? constraint.selfRelatedValue : "-"}</td>
                                            </tr>
                                        )
                                    })}


                                    </tbody>
                                </table>
                                <div className={'flex w-full justify-end'}>
                                    <div className={'flex gap-2'}>
                                    <label htmlFor="constraints-list"
                                           className="btn btn-sm bg-teal-400 border-none hover:bg-teal-500 shadow-sm">
                                        Close
                                    </label>
                                        {constraintsData.length ? <button onClick={async () =>{
                                                const response = await api.post("/api/save-strategy/", {
                                                    user: user.user_id,
                                                    name: strategyName,
                                                    strategy_data: JSON.stringify(constraintsData)
                                                })

                                            if(response){
                                                if(response.status === 200){
                                                    navigate.push("/dashboard")
                                                }

                                            }
                                        }
                                        } className={'btn btn-sm bg-cyan-400 border-none hover:bg-cyan-500 shadow-sm'}>Confirm</button> : <></>}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </>

        )
    }

    return (
        <div className={'h-[100vh]'}>
            <div className={'flex justify-between'}>
                <div className={'flex flex-col gap-2'}>
                    <h1 className={' text-3xl font-extrabold'}>Strategy Creation</h1>
                    <p className={'opacity-70 '}>Create fully personalized strategies to use with your Watchlists</p>
                </div>
                <div className={'flex gap-6'}>
                    <button className={'btn bg-white border-none hover:bg-white'}>
                        <div className={'flex gap-2 justify-between items-center flex-row-reverse'}>
                            <p className={'text-indigo-500 text-sm'}>Edit Strategy</p>
                            <PencilIcon className={'w-5 h-5 stroke-indigo-500'}/>
                        </div>
                    </button>
                    <button className={'btn bg-indigo-500 border-none hover:bg-indigo-600'}>
                        <div className={'flex gap-2 justify-between items-center flex-row-reverse'}>
                            <p onClick={() =>{
                                navigate.push("/dashboard")
                            }} className={'text-accent-content text-sm'}>Reset</p>
                            <TrashIcon className={'w-5 h-5 stroke-white'}/>
                        </div>
                    </button>
                </div>
            </div>
            <div className={'strategy-creation-grid w-full h-full mt-14 gap-x-10 gap-y-20 items-center'}>
                <div className={'bg-white h-max col-span-2 rounded-box shadow-md '}>
                    <div className={'p-8'}>
                        <div className={'flex flex-col  gap-4'}>
                            <div>
                                <h3 className={'text-lg font-bold'}>Dummy Data</h3>
                            </div>
                            <div className={'relative '}>
                                <DummyLinePlot data={{


                                    labels: dummyChartingData['index'],
                                    datasets: !fullIndicatorsData[currentSubPlot].isSub ? [
                                        {
                                            label: 'Price',
                                            data: dummyChartingData['Close'],
                                            borderColor: 'rgb(255, 99, 132)',
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        },
                                        ...additionalPlottingData

                                    ] : [
                                        {
                                            label: 'Price',
                                            data: dummyChartingData['Close'],
                                            borderColor: 'rgb(255, 99, 132)',
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        }
                                    ]


                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={'bg-base-100 shadow-md rounded-box h-max w-full col-span-2  w-[80%] justify-self-center  '}>
                    <div className={'flex flex-col gap-4 p-6'}>
                        <div>
                            <div className={'flex gap-2 items-center'}>
                                <h3 className={'text-lg font-bold'}>Subplot:</h3>
                                <p className={'text opacity-70'}>{indicators[currentSubPlot].isSub ? currentSubPlot : `Subplot is not available for ${currentSubPlot}`}</p>
                            </div>
                        </div>
                        {indicators[currentSubPlot].isSub ? <div className={'relative '}>

                            <DummyLinePlot data={{


                                labels: dummyChartingData['index'],

                                datasets: indicators[currentSubPlot].isSub ? [

                                    ...additionalPlottingData
                                ] : []
                            }}/>
                        </div> : <></>}

                    </div>

                </div>
                <div
                    className={'bg-white shadow-md rounded-box p-5  h-[28rem] hide-scrollbar hover:show-scrollbar  overflow-y-scroll'}>

                    <div className={'flex flex-col gap-8'}>
                        <div className={'flex flex-col gap-1'}>
                            <p className={'text-m font-bold'}>Indicators</p>
                            <p className={'text-xs opacity-70'}>Only default indicators are available for plotting</p>
                        </div>
                        <div className={'flex flex-col gap-4 h-full'}>

                            {Object.keys(indicators).map((indicator, index) => {

                                return (
                                    indicators[indicator].show ?
                                        <div className={'flex justify-between items-center'} key={index}>
                                            <div className={'flex flex-col gap-2'}>
                                                <p className={'text-l font-bold'}>{indicator}</p>
                                                <p className={'text-sm opacity-70'}>{indicators[indicator].description}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => {
                                                    setCurrentSubplot(indicator)
                                                }}
                                                        className={`btn btn-xs border-none ${currentSubPlot === indicator ? "bg-green-500 hover:bg-green-600" : "bg-indigo-300 hover:bg-indigo-400"}`}>{currentSubPlot === indicator ? "Active" : "Activate"}</button>
                                            </div>
                                        </div> : <></>
                                )
                            })
                            }

                        </div>

                    </div>

                </div>
                <div
                    className={'bg-white shadow-md rounded-box p-5 h-max hide-scrollbar hover:show-scrollbar  overflow-y-scroll h-[28rem]'}>
                    <IndicatorMenu/>
                </div>


                {/*Bottom left*/}


                <div className={'bg-base-100 shadow-md rounded-box h-full w-full col-span-2 p-6'}>

                    <StrategyMenu/>
                </div>

            </div>

            {createPortal(
                <ListAllConstraintsTable/>, document.getElementById("overlay-root"))}

        </div>
    )


}