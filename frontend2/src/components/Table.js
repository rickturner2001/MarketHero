import {useEffect, useState} from "react";
import {Chart} from "chart.js/auto";
import {Bar} from "react-chartjs-2"
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from "@heroicons/react/solid";

export const Table = ({tableData, classesOnValues, paginationvalue, isWatchlistTable, className}) =>{

    const classes =  "flex flex-col gap-6 justify-center items-center w-[100%]" + (className ? ` ${className}` : "")

    let [tableHeads, tableRows] = tableData

    const [currentBatch, setCurrentBatch] = useState(1)
    let [currentTableRows, setCurrentTableRows] = useState(tableRows.slice(
        currentBatch * paginationvalue - paginationvalue, currentBatch * paginationvalue))

    const nextPage = () =>{
        console.debug(`Transitioning from batch: ${currentBatch}`)
        setCurrentBatch(currentBatch + 1)
        console.debug(`To batch: ${currentBatch}`)
        setCurrentTableRows(tableRows.slice(
            currentBatch + 1 * paginationvalue - paginationvalue, currentBatch + 1 * paginationvalue))
    }

    const previousPage = () =>{
        setCurrentBatch(currentBatch - 1)
        setCurrentTableRows(tableRows.slice(
            currentBatch * paginationvalue - paginationvalue, currentBatch * paginationvalue))
    }



    return(
        <div className={classes}>
        <div className="overflow-x-auto shadow-2xl">
            <table className="table table-zebra w-full ">
                <thead>
                <tr className='text-center'>
                    {tableHeads.map((head, index) => <th key={index}>{head}</th>)}
                </tr>
                </thead>
                <tbody>

                {currentTableRows.map((rowData, index) => {
                    return <tr key={index + 600}>
                                {rowData.map(((tableData, index) => {
                                    return <td className='' key={index}>
                                        <p  key={index * -1} className={`text-center ${classesOnValues?.constraint(tableData)}`}>{tableData}</p>
                                    </td>
                                }))}
                           </tr>
                })}
                </tbody>
            </table>
        </div>

        {paginationvalue ? <div className="btn-group mb-3">
            <button className={`btn ${currentBatch <= 1 ? "btn-disabled" : ""}`}  onClick={previousPage}><ChevronDoubleLeftIcon className={'w-5 h-5'}/></button>
            <button className="btn">Page {currentBatch}</button>
            <button className="btn"  onClick={nextPage}><ChevronDoubleRightIcon className={'w-5 h-5'}/></button>
        </div> : <></>}

        </div>

    )
}