import {ArrowUpIcon, CheckIcon, PlusIcon} from "@heroicons/react/solid";
import {useContext, useEffect, useState} from "react";
import {ArrowDownIcon, BeakerIcon, PencilIcon, TrashIcon} from "@heroicons/react/outline";
import {Link} from "react-scroll";
import useAxios from "../../utils/useAxsios";
import AuthContext from "../../context/AuthContext";

export const StrategiesMenu = () => {

    const [currentEdit, setCurrentEdit] = useState("RSI")
    const [relationships, setRelationships] = useState({})
    const [firstIndicator, setFirstIndicator] = useState("")
    const [relateTo, setRelateTo] = useState("")
    const [secondIndicator, setSecondIndicator] = useState("");
    const [relationshipType, setRelationshipType] = useState("")
    const [selfRelatedValue, setSelfRelatedValue] = useState("")
    const [finalSubIndicator, setSubIndicator] = useState("")
    const [finalSecondSubIndicator, setSecondSubIndicator] = useState("")
    const [newIndicatorName, setNewIndicatorName] = useState("")
    const [newIndicatorType, setNewIndicatorType] = useState("")
    const [successfulAddition, setSuccessfulAddition] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [confirmAll, setConfirmAll] = useState(false)
    const [strategyTitle, setStrategyTitle] = useState("")
    const [successfulResponse, setSuccessfulResponse] = useState(false)

    const {authTokens, logoutUser, user} = useContext(AuthContext)


    const directionCurrentStep = () => {
        if (currentStep === 1) {
            if (indicatorsCollection[firstIndicator].subIndicators) {
                setCurrentStep(currentStep + 1)
                return 1
            } else {
                setCurrentStep(currentStep + 2)
                return 2
            }
        } else if (currentStep === 2 || currentStep === 3 || currentStep === 0 || currentStep === 7) {
            setCurrentStep(currentStep + 1)
            return 1
        } else if (currentStep === 4) {
            if (relateTo === "Value") {
                setCurrentStep(currentStep + 3)
                return 3
            } else {
                setCurrentStep(currentStep + 1)
                return 1
            }
        } else if (currentStep === 5) {
            if (indicatorsCollection[secondIndicator].subIndicators) {
                setCurrentStep(currentStep + 1)
                return 1
            } else {
                setCurrentStep(currentStep + 3)
                return 3
            }
        } else if (currentStep === 6) {
            setCurrentStep(currentStep + 2)
            return 2
        } else {
            return 0
        }
    }


    const api = useAxios()


    const post_strategy = async () => {
        const response = await api.post(`/api/save-strategy/`, {
            user: user.user_id,
            name: strategyTitle,
            strategy_data: JSON.stringify(relationships)
        })
        if (response.status === 200) {
            setSuccessfulResponse(true)
        } else {
            console.log(response)
        }
    }

    const registerRelationship = (relationshipData) => {
        let current = Object.keys(relationships).length
        let currentRelationships = relationships
        currentRelationships[current] = relationshipData
        setRelationships(currentRelationships)
        console.log(currentRelationships)
    }

    const indicators = {

        RSI: {
            description: "Relative Strength Index", inputs: ["Period"], params: [14], subIndicators: false
        }, MACD: {
            description: "Moving average convergence divergence",
            inputs: ["Slow", "Fast", "Smoothing"],
            params: [26, 12, 9],
            subIndicators: ["MACD", "Signal", "Historgram"]
        },

        MA: {
            description: "Moving Average",
            inputs: ["Period"],
            params: [20],
            subIndicators: false
        },

        Bollinger: {
            description: "Bollinger Bands",
            inputs: ['Period', "Std", "Offset"],
            params: [20, 2, 0],
            subIndicators: ["Lower Band", "Middle Band", "Upper Band"]
        },

        Stochastic: {
            description: "Stochastic Oscillator",
            inputs: ["K Period", "D Period"],
            params: [14, 3],
            subIndicators: ["Stochastic K", "Stochastic D"]
        },

        Price: {
            description: "Closing Price", inputs: [], params: [], subIndicators: false
        }
    }

    const [indicatorsCollection, setIndicatorsCollection] = useState(indicators)

    useEffect(() => {
        try {
            setStrategyInstantiationMenu(<StrategyInstantiationMenu
                currentStep={currentStep + directionCurrentStep()}/>)
        } catch (e) {
            console.log(e.toString())
        }
    }, [firstIndicator, secondIndicator, finalSubIndicator, finalSecondSubIndicator,
        relateTo, relationshipType, selfRelatedValue, indicatorsCollection, relationships, strategyTitle, successfulResponse])


    const stepsData = {
        1: {
            id: "firstIndicator",
            title: "First Indicator",
            subTitle: () => <p className={'py-6'}>Main indicator responsible for the behavior of the strategy</p>,
            mapper: Object.keys(indicatorsCollection),
            setter: setFirstIndicator,
        }, 2: {
            id: "subIndicator",
            title: "Sub Indicator",
            subTitle: () => <p className={'py-6'}>Choose a sub Indicator for the {firstIndicator} indicator</p>,
            mapper: indicatorsCollection[firstIndicator]?.subIndicators,
            setter: setSubIndicator
        }, 3: {
            id: "relateTo", title: "Relate To", subTitle: () => <p className={'py-6'}>Do you want to
                compare <strong>{finalSubIndicator ? finalSubIndicator : firstIndicator}</strong> to a value or another
                indicator?</p>, mapper: ['Indicator', "Value"], setter: setRelateTo,
        }, 4: {
            id: "relationshipType",
            title: "Relationship Type",
            subTitle: () => <p className={'py-6'}>Define the dynamic of the relationship between the two parameters</p>,
            mapper: ["Less Than", "Equal to", "Greater Than"],
            setter: setRelationshipType,
        }, 5: {
            id: "relationshipType",
            title: "Second Indicator",
            subTitle: () => <p className={'py-6'}>Select and indicator to compare to <strong>{firstIndicator}</strong>
            </p>,
            mapper: Object.keys(indicatorsCollection),
            setter: setSecondIndicator
        }, 6: {
            id: "secondSubIndicator",
            title: "Second Sub Indicator",
            subTitle: () => <p>Select a sub indicator for <strong>{secondIndicator}</strong></p>,
            mapper: indicatorsCollection[secondIndicator]?.subIndicators,
            setter: setSecondSubIndicator
        }, 7: {
            id: "indicatorValue",
            title: "Indicator Value",
            subTitle: () => <p className={'py-6'}>Define a numeric value for <strong>{firstIndicator}</strong> indicator
            </p>,
            mapper: [],
            setter: setSelfRelatedValue
        },
        8: {
            id: "confirmRelationship",
            title: "Confirm Relationship",
            subTitle: () => <p className={'py-6'}>Confirm the inputs for the current relationship</p>,
            mapper: [firstIndicator, finalSubIndicator, relationshipType, secondIndicator, finalSecondSubIndicator, selfRelatedValue].filter((v) => v),
            setter: setRelationships
        }

    }


    const isNumeric = (str) => {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    const MockEditingMenu = () => {
        return (<div className={'flex justify-around min-w-[30rem]'}>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">


                    <div className="form-control mt-6">
                        <button className="btn btn-primary">Login</button>
                    </div>
                </div>
            </div>
        </div>)
    }

    const IndicatorMenu = ({indicator}) => {

        let inputs = {}

        return (<div className={'flex justify-around min-w-[30rem] flex-col items-center'}>
            <div className="card flex-shrink-0 w-[100%] max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <h1 className={'text-2xl font-bold text-center mb-4'}>{indicator}</h1>
                    <div className={'flex gap-2'}>

                        {indicatorsCollection[indicator].inputs.map((input, index) => {
                            return (<div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">{input}</span>
                                </label>
                                <input type="text" placeholder="123"
                                       className="input input-bordered w-full max-w-xs" onChange={(e) => {
                                    if (isNumeric(e.target.value)) {
                                        inputs[index] = e.target.value
                                    }
                                }}/>
                            </div>)
                        })}
                    </div>
                    <div className="form-control mt-6">
                        <button
                            className={`btn btn-primary`} onClick={() => {
                            let tempIndicatorsCollection = indicatorsCollection
                            tempIndicatorsCollection[indicator].params = Object.values(inputs)
                            setIndicatorsCollection(tempIndicatorsCollection)
                            setIndicatorsTable(<IndicatorsTable indicatorsCollection={indicatorsCollection}/>)
                            setSuccessfulAddition(true)
                            setTimeout(() => {
                                setSuccessfulAddition(false)
                            }, 3000)

                        }}>Confirm Changes
                        </button>

                    </div>

                </div>


            </div>

            {successfulAddition ? <div className="alert alert-success shadow-lg mt-6 w-full text-center">
                <div className={'w-[100%] flex justify-center items-center'}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Successfully Updated inputs for {indicator}</span>
                </div>
            </div> : <></>}
        </div>)
    }

    const TableRow = ({indicator, description, params}) => {

        return (<tr>
            <td>
                <button onClick={() => {
                    setCurrentEdit(indicator)
                }}
                        className={'btn btn-sm btn-circle rounded-full'}><PencilIcon className={'w-5 h-5'}/>
                </button>
            </td>
            <th>{indicator}</th>
            <td>{description}</td>
            <td><p className={'font-bold'}>{params}</p></td>
        </tr>)
    }

    const IndicatorsTable = ({indicatorsCollection}) => {
        return (<div className="overflow-visible">
            <table className="table  w-full text-center shadow-2xl">
                <thead>
                <tr>
                    <th></th>
                    <th>Indicator</th>
                    <th>Description</th>
                    <th>Parameters</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(indicatorsCollection).map(((indicator) => {
                    return <TableRow indicator={indicator} description={indicatorsCollection[indicator].description}
                                     params={indicatorsCollection[indicator].params.toString()}/>
                }))}
                </tbody>
            </table>
        </div>)
    }

    const NumericInput = ({updateTo}) => {
        const [input, setInput] = useState("")
        const [validInput, setValidInput] = useState(false)

        useEffect(() => {

        }, [input])

        return (<>
                <label className="label">
                    <span className="label-text text-current">Trigger Value</span>
                </label>
                <div className={'flex  gap-4 items-center'}>
                    <input type="text" placeholder="Type here"
                           className={`input input-bordered w-full max-w-xs text-base-content appearance-none`}
                           onChange={(e) => {
                               if (!isNaN(e.target.value) && !(e.target.value === "")) {
                                   setInput(e.target.value)
                                   setValidInput(true)
                               } else {
                                   setValidInput(false)
                               }

                           }}/>
                    <button
                        className={`btn  transition-colors duration-500 ${validInput ? "btn-secondary" : "btn-error"}`}>
                        <CheckIcon className={'w-5 w-6'} onClick={() => {
                            setTimeout(() => {
                                setSelfRelatedValue(input)
                            }, 500)
                            setStrategyInstantiationMenu(updateTo)
                        }}/></button>
                </div>

                {!validInput ? <label className="label animation-appear">
                    <span className="label-text-alt text-error">Invalid Input! Value must be numeric</span>
                </label> : <></>}
            </>

        )
    }

    const StepsBar = ({firstIndicator, secondIndicator, relationshipType, compareTo}) => {


        return (<ul className="steps steps-vertical text-accent-content">
            <li className={`step transition-colors  duration-500 ${firstIndicator ? "step-primary" : ""}`}>First
                Argument
            </li>
            <li className={`step transition-colors duration-500 ${compareTo ? "step-primary" : ""}`}>Compare to</li>

            <li className={`step transition-colors duration-500 ${relationshipType ? "step-primary" : ""}`}>Relationship
                Type
            </li>
            <li className={`step transition-colors duration-500 ${secondIndicator || selfRelatedValue ? "step-primary" : ""}`}>{compareTo === "Value" ? "Value" : "Second Argument"}
            </li>
            <li className={`step transition-colors duration-500 ${confirmAll ? "step-primary" : ""}`}>Confirm Inputs
            </li>

        </ul>)
    }

    const composeRelationshipRegistrationData = (name) => {
        if (relateTo === 'Indicator') {
            return {
                name: name,
                firstIndicator: firstIndicator, firstDescription: indicatorsCollection[firstIndicator].description,
                subIndicator: finalSubIndicator,
                params: indicatorsCollection[firstIndicator].params,
                relateTo: relateTo,
                relationshipType: relationshipType,
                secondIndicator: secondIndicator,
                secondSubIndicator: finalSecondSubIndicator,
                secondDescription: indicatorsCollection[secondIndicator].description,
                paramsSecondary: indicatorsCollection[secondIndicator].params
            }
        } else if (relateTo === "Value"){
            return {
                name: name,
                firstIndicator: firstIndicator, firstDescription: indicatorsCollection[firstIndicator].description,
                subIndicator: finalSubIndicator,
                params: indicatorsCollection[firstIndicator].params,
                relateTo: relateTo,
                relationshipType: relationshipType,
                selfRelatedValue: selfRelatedValue
            }
        }
    }

    const RelationshipConfirmationTable = () => {
        const [confirmFirst, setConfirmFirst] = useState(false)
        const [confirmSecond, setConfirmSecond] = useState(false)
        const [confirmFirstSub, setConfirmFirstSub] = useState(false)
        const [confirmSecondSub, setConfirmSecondSub] = useState(false)
        const [confirmRelType, setConfirmRelType] = useState(false)
        const [confirmRelateTo, setConfirmRelateTo] = useState(false)
        const [confirmSelfRel, setConfirmSelfRel] = useState(false)
        const [confirm, setConfirm] = useState(false)
        const [relationshipTitle, setRelationshipTitle] = useState("")



        // Increments by 1 for every confirmation
        const [validationCounter, setValidationCounter] = useState(0)

        // Get a list of all defined values and (filter out null values)
        const definedValues = [firstIndicator, secondIndicator, finalSecondSubIndicator, finalSubIndicator, relationshipType, relateTo, selfRelatedValue].filter((v) => v)


        const defaultAllParams = () =>{
            setConfirmFirst(false)
            setConfirmSecond(false)
            setConfirmFirstSub(false)
            setConfirmSecondSub(false)
            setConfirmRelateTo(false)
            setConfirmRelType(false)
            setConfirm(false)
            setConfirmSelfRel(false)
            setFirstIndicator("")
            setSecondIndicator("")
            setSubIndicator("")
            setSecondSubIndicator("")
            setRelationshipType("")
            setRelateTo("")
            setSelfRelatedValue("")
            setCurrentStep(0)
        }

        //Update table component on each confirmation
        useEffect(() => {
            if (validationCounter === definedValues.length) {
                setConfirm(true)
            }
        }, [validationCounter, relationshipTitle])

        const TableRow = ({label, value, toConfirm, setConfirm}) => {
            return (
                value ?
                    <tr className={`${toConfirm ? "text-accent-content" : ""}`}>
                        <th className={`transition-colors duration-500 border-none ${toConfirm ? "bg-primary" : ""}`}>
                            <label>
                                <input type="checkbox" className="checkbox" checked={toConfirm} onChange={() =>{
                                    setConfirm(!confirm)
                                    if(!toConfirm){
                                        setValidationCounter(validationCounter + 1)
                                    }else{
                                        setValidationCounter(validationCounter - 1)
                                    }
                                }
                                }/>
                            </label>
                        </th>
                    <th className={`transition-colors duration-500 border-none ${toConfirm ? 'bg-primary' : ""}`}>{label}</th>
                    <td className={`transition-colors duration-500 border-none ${toConfirm ? 'bg-primary' : ""}`}>{value}</td>
                        <th className={`transition-colors duration-500 border-none ${toConfirm ? 'bg-primary' : ""}`}>
                            <button className="btn btn-ghost btn-xs"><PencilIcon className={'w-5 h-5'}/></button>
                        </th>

                </tr>
                    : <></>)
        }

        return (
            <div className={'flex flex-col text-base-content gap-4 justify-center items-center'}>
                {confirm ? <div className={'flex animation-appear'}>
                    <input type={'text'} placeholder={'AwesomeTitle01'}
                           className={'input input-bordered rounded-none rounded-l-lg'} onChange={(e) => setRelationshipTitle(e.target.value) }/>
                    <Link to='displayRelationships' spy={true} offset={-100} smooth={true} duration={500} className={'btn btn-secondary rounded-none rounded-r-lg'} onClick={() => {
                        registerRelationship(
                            composeRelationshipRegistrationData(relationshipTitle ? relationshipTitle : `UnNamed_${Object.keys(relationships).length ? Object.keys(relationships).length - 1 : 0}`)
                        )
                        defaultAllParams()
                    }
                    }><CheckIcon className={'w-5 h-5'}/></Link>
                </div> : <></>}
                <table className="table w-full text-current text-center">
                    <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox"/>
                            </label>
                        </th>
                        <th>Label</th>
                        <th>Value</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <TableRow label={"First Indicator"} value={firstIndicator} toConfirm={confirmFirst}
                              setConfirm={setConfirmFirst}/>
                    <TableRow label={"Sub Indicator (First)"} value={finalSubIndicator} toConfirm={confirmFirstSub}
                              setConfirm={setConfirmFirstSub}/>
                    <TableRow label={"Second Indicator"} value={secondIndicator} toConfirm={confirmSecond}
                              setConfirm={setConfirmSecond}/>
                    <TableRow label={"Sub Indicator (Second)"} value={finalSecondSubIndicator}
                              toConfirm={confirmSecondSub}
                              setConfirm={setConfirmSecondSub}/>
                    <TableRow label={"Relate To"} value={relateTo} toConfirm={confirmRelateTo}
                              setConfirm={setConfirmRelateTo}/>
                    <TableRow label={"Relationship Type"} value={relationshipType} toConfirm={confirmRelType}
                              setConfirm={setConfirmRelType}/>
                    <TableRow label={"Indicator Value"} value={selfRelatedValue} toConfirm={confirmSelfRel}
                              setConfirm={setConfirmSelfRel}/>
                    </tbody>
                </table>
            </div>

        )
    }

    const RelationshipDefinitionIndicatorsMenu = ({id, title, subTitle, setter, mapper, slideAway, currentStep}) => {
        return (<div className={'flex flex-col gap-10 items-center'}>
            <div
                className={`hero-content text-accent-content text-center w-[100%] flex gap-12 w-[63rem] items-center h-[100%]  ${slideAway ? "animation-keep-sliding-up opacity-0" : "animation-slide-up"}`}
                id={id}>
                <div>
                    <h1 className="text-4xl font-bold text-center">{title}</h1>
                    {subTitle()}
                </div>
                <div
                    className={`w-[100%]`}>
                    <div
                        className={`${currentStep !== 8 ? "grid grid-cols-3" : "flex "} gap-24 min-w-[40rem] items-center`}>

                        {currentStep === 8 ?
                            <RelationshipConfirmationTable/>
                            : currentStep !== parseInt(Object.keys(stepsData)[Object.keys(stepsData).length - 2]) ? mapper.map((value, index) => {
                                return (
                                    currentStep === 8 ? <div className={'indicator'}>
                                        <div className="indicator-item indicator-bottom">
                                            <button className="btn btn-primary rounded-full btn-sm"><CheckIcon
                                                className={'w-4 h-4'}/></button>
                                        </div>
                                        <button
                                            key={index}
                                            className={` border-none transition-colors duration-500 py-6 px-9 ${currentStep === 8 ? "btn bg-accent hover:bg-accent-focus" : "btn bg-primary hover:bg-primary-focus"}`}
                                            onClick={() => {

                                                setTimeout(() => {
                                                    setter(value)
                                                }, 500)
                                                setStrategyInstantiationMenu(<StrategyInstantiationMenu
                                                    currentStep={currentStep}
                                                    slideAway={true}/>)
                                            }}>
                                            {value}
                                        </button>

                                    </div> : <button
                                        key={index}
                                        className={` border-none transition-colors duration-500 ${currentStep === 8 ? "btn bg-accent hover:bg-accent-focus" : "btn bg-primary hover:bg-primary-focus"}`}
                                        onClick={() => {

                                            setTimeout(() => {
                                                setter(value)
                                            }, 500)
                                            setStrategyInstantiationMenu(<StrategyInstantiationMenu
                                                currentStep={currentStep}
                                                slideAway={true}/>)
                                        }}>
                                        {value}
                                    </button>

                                )
                            }) : <>
                                <div className="form-control w-full max-w-xs">
                                    <NumericInput updateTo={<StrategyInstantiationMenu
                                        currentStep={currentStep}
                                        slideAway={true}/>}/>
                                </div>

                            </>}

                    </div>

                </div>


            </div>

        </div>)
    }


    const StrategyInstantiationMenu = ({isCreating, currentStep, slideAway}) => {
        return (<>
                <div id={'relationshipMenu'}
                     className={`hero min-h-screen bg-base-100   ${isCreating ? "duration-500 opacity-0" : ""}`}>
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Create a new Strategy</h1>
                            <p className={'py-6'}>Create personalized <strong>strategies</strong> by defining
                                relationships
                                between values and indicators</p>
                            <Link to='firstIndicator' spy={true} offset={-100} smooth={true} duration={500}
                                  className="btn btn-secondary">Get Started
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={`hero min-h-screen bg-current`}>
                    <div className={'flex gap-24'}>
                        <StepsBar firstIndicator={firstIndicator} relationshipType={relationshipType}
                                  secondIndicator={secondIndicator} compareTo={relateTo}/>

                        <RelationshipDefinitionIndicatorsMenu id={stepsData[currentStep].id}
                                                              title={stepsData[currentStep].title}
                                                              subTitle={stepsData[currentStep].subTitle}
                                                              mapper={stepsData[currentStep].mapper}
                                                              setter={stepsData[currentStep].setter}
                                                              slideAway={slideAway}
                                                              currentStep={currentStep}
                        />

                    </div>

                </div>


            </>

        )
    }

    const [strategyInstantiationMenu, setStrategyInstantiationMenu] = useState(<StrategyInstantiationMenu
        isCreating={false} currentStep={currentStep}/>)

    const [indicatorsTable, setIndicatorsTable] = useState(<IndicatorsTable
        indicatorsCollection={indicatorsCollection}/>)


    const DisplayRelationships = () => {
        return(
            Object.keys(relationships).length ?
                <>
                    <div className="hero min-h-screen bg-base-100" >
                        <div className="hero-content flex-col lg:flex-row gap-24" id={'displayRelationships'}>
                            <div className="overflow-x-visible flex flex-col gap-10">
                                <div className={'flex gap-4 justify-center items-center'}>
                                    <input type={'text'} id={'title'} placeholder={"MyStrategy01"} className={'input input-bordered'}/>
                                    <button className={'btn btn-primary btn-sm'} onClick={() =>{
                                        setStrategyTitle(document.getElementById("title").value)
                                    }}><CheckIcon className={'w-5 h-5'}/></button>
                                </div>
                                <table className="table table-zebra w-full text-center">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>First Indicator</th>
                                        <th>Relationship Type</th>
                                        <th>Relate To</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(relationships).map((relationship, index) =>{
                                        return(
                                            <tr>
                                                <td>{relationships[relationship].name}</td>
                                                <td>{relationships[relationship].firstIndicator}</td>
                                                <td>{relationships[relationship].relationshipType}</td>
                                                <td>{relationships[relationship].relateTo}</td>
                                                <th onClick={() =>{
                                                    let currentRelationships = relationships
                                                    delete currentRelationships[relationship]
                                                    setRelationships(currentRelationships)
                                                }}>
                                                    <label>
                                                        <button className={'btn btn-error btn-sm'}><TrashIcon className={'w-5 h-5 stroke-accent-content'}/></button>
                                                    </label>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold">Defined Relationships</h1>
                                <p className="py-6"> <strong>merge</strong> the relationships all together to create a <strong>strategy</strong>. You can
                                track your strategy in the <a className={'link'}>strategies menu</a></p>
                                <div className={'flex gap-6'}>
                                <button onClick={() =>{
                                    post_strategy()
                                }} className="btn bg-purple-500 border-none hover:bg-purple-600">
                                    <div className={'flex gap-2 items-center justify-center'}>
                                        <p>Merge</p>
                                        <BeakerIcon className={'w-5 h-5'}/>
                                    </div>
                                    </button>
                                    <Link to='firstIndicator' spy={true} offset={-100} smooth={true} duration={500}
                                        className={'btn btn-secondary btn-outline '}>
                                        <ArrowUpIcon className={'w-4 h-4'}/>
                                    </Link>
                                </div>
                                {successfulResponse ? <div className="mt-6 alert alert-success shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span>Successfully added a new strategy!</span>
                                    </div>
                                </div> : <></>}
                            </div>
                        </div>
                    </div>
                </>
                :
                <div id={'displayRelationships'}>
                </div>
        )
    }

    return (<>
        <div className="hero min-h-screen bg-current">
            <div className={'flex flex-col gap-12'}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    {currentEdit ? <IndicatorMenu indicator={currentEdit}/> : <MockEditingMenu/>}
                    <div>
                        <div className={'flex flex-col gap-4'}>

                            <div className={'flex bg-base-200 px-3 py-6 gap-2'}>
                                <button className={'btn btn-primary'} onClick={() => {

                                    let tempIndicatorsCollection = indicatorsCollection
                                    tempIndicatorsCollection[newIndicatorName] = {
                                        description: indicators[newIndicatorType].description,
                                        inputs: indicators[newIndicatorType].inputs,
                                        params: indicators[newIndicatorType].params,
                                    }

                                    setIndicatorsCollection(tempIndicatorsCollection)
                                    setIndicatorsTable(<IndicatorsTable
                                        indicatorsCollection={indicatorsCollection}/>)
                                }}>
                                    <PlusIcon className={'h-5 w-5'}/>
                                </button>
                                <div>
                                    <div className={'flex gap-4'}>
                                        <select className="select  w-full max-w-xs" onChange={(e) => {
                                            setNewIndicatorType(e.target.value)
                                        }}>
                                            <option>Indicator Type</option>
                                            <option value={'MA'}>Moving Average</option>
                                            <option value={'RSI'}>Relative Strength Index</option>
                                            <option value={'MACD'}>Moving average convergence divergence</option>
                                            <option value={'Bollinger'}>Bollinger Bands</option>
                                            <option value={'Stochastic'}>Stochastic Oscillator</option>
                                        </select>
                                        <input onChange={(e) => {
                                            setNewIndicatorName(e.target.value)
                                        }} type="text" placeholder="Indicator Name"
                                               className="input w-full max-w-xs"/>
                                    </div>

                                </div>

                            </div>
                            {indicatorsTable}

                        </div>
                    </div>
                </div>
                <div className={'flex w-[100%] justify-center'}>
                    <Link to='relationshipMenu' spy={true} offset={-100} smooth={true} duration={500}
                          className={" "}>
                        <ArrowDownIcon
                            className={'w-6 h-6 animate-bounce fill-accent-content stroke-accent-content'}/>
                    </Link>
                </div>
            </div>
        </div>

        {strategyInstantiationMenu}
        <DisplayRelationships/>

    </>)
}