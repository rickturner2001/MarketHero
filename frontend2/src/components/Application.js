import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxsios";
import {Hero} from "./Hero";
import {Table} from "./Table";
import {observe} from "web-vitals/dist/modules/lib/observe";
import {NegativeSefiPlot, SefiPlot} from "./charts/SefiPlot";
import axios from "axios";

export const Application = () =>{

    let [marketData, setMarketData] = useState()
    let {authTokens, logoutUser, user} = useContext(AuthContext)

    let api = useAxios()



    useEffect(()=> {
        const getGeneralMarketData = async() =>{
            let response = await api.get('/api/market-data/general')

            if(response.status === 200){
                setMarketData(response.data)
            }

        }
        getGeneralMarketData()
    }, [])

    const tableEntriesData = {}

    const stats = (marketData) =>{

        const tickers = Object.keys(marketData.entries)
        //
        const totalSignalsPerTicker = {}
        tickers.map((ticker, index) =>{
            totalSignalsPerTicker[ticker] = 0
            tableEntriesData[ticker] = {}
            Object.keys(marketData.entries[ticker]).map((strategy, location) =>{
                if(marketData.entries[ticker][strategy].status){
                    totalSignalsPerTicker[ticker]++
                }
                tableEntriesData[ticker][strategy] = marketData.entries[ticker][strategy].status
                return
            })
        })
        return (
            <div className="stats shadow-2xl ">

                <div className="stat place-items-center">
                    <div className="stat-title">Entries</div>
                    <div className="stat-value">{tickers.length}</div>
                    {/*<div className="stat-desc"></div>*/}
                </div>

                <div className="stat place-items-center">
                    <div className="stat-title">Multiple Indicators</div>
                    <div className="stat-value text-secondary">{Object.values(totalSignalsPerTicker).filter(val => val > 1).length}</div>
                    {/*<div className="stat-desc text-secondary"></div>*/}
                </div>

                <div className="stat place-items-center">
                    <div className="stat-title">Single Indicator</div>
                    <div className="stat-value">{Object.values(totalSignalsPerTicker).filter(val => val === 1).length}</div>
                    {/*<div className="stat-value"></div>*/}
                </div>

            </div>
        )
    }

    const fixUnderscoredKey = (key) =>{
        let splitKey = key.split("_")
        let fullKey = ""
        for (let word of splitKey){
            if (word === splitKey[splitKey.length]){
                fullKey += word[0].toUpperCase() + word.substring(1)
            }else {
                fullKey += word[0].toUpperCase() + word.substring(1) + " "
            }
        }
        return fullKey
    }

    const getEntriesTableData = () =>{

            const entriesKey = Object.keys(marketData)[1]
            const tickers = Object.keys(marketData[entriesKey])

            const entriesTableHeads = Object.keys(marketData[entriesKey][tickers[0]]).map((head) =>{
                return fixUnderscoredKey(head)
            })
            entriesTableHeads.unshift("Ticker")
            entriesTableHeads.unshift("")
            const entriesTableRows = []
            tickers.map((ticker, index) => {
                const temp = [index + 1, ticker]
                Object.keys(tableEntriesData[ticker]).map((strategy) => {
                    let key = String(tableEntriesData[ticker][strategy])
                    const firstLetter = key[0].toUpperCase()
                    let newKey = firstLetter + key.slice(1, key.length)
                    temp.push(newKey)
                })
                entriesTableRows.push(temp)
            })

            return [entriesTableHeads, entriesTableRows]

    }

    return(

        <div className='flex mt-10 ml-10 mr-10'>
            {/*Left side*/}
            <div>

                    {marketData ?
                        <div className='flex flex-col gap-16 '>
                        {stats(marketData)}
                            <div className='flex flex-col bg-base-300 px-6 pt-4'>
                                <div className="tabs tabs-boxed flex justify-center bg-base-100 mb-10">
                                    <a className="tab tab-active">All</a>
                                    <a className="tab">Single entries</a>
                                    <a className="tab">Multiple entries</a>
                                </div>
                            <Table tableData={getEntriesTableData()} classesOnValues={{constraint : (value) =>{
                                if(value === 'True'){
                                    return "badge badge-success"
                                }else if(value === "False"){
                                    return "badge badge-error"
                                }
                            }

                            }} paginationvalue={10}/>

                            </div>

                        </div>
                        : <></>}

            </div>

        {/*Right side*/}
            <div className='w-[100%] flex flex-col justify-center items-center'>
                <div className='w-[80%] flex flex-col gap-10 bg-current px-4'>
                    <div className='shadow-md'>
                        {marketData ? <SefiPlot marketData={marketData}/> : <></>}
                    </div>
                    <div className='shadow-md'>
                        {marketData ? <NegativeSefiPlot marketData={marketData}/> : <></>}

                    </div>
                </div>
            </div>

        </div>
    )
}