export const RegularTable = ({tableRows, tableHeads, className, hasHeaderCol}) =>{
    console.log(tableRows)
    return(
        <table className={`table w-full text-center ${className ? className : ""}`}>
            <thead>
            <tr className={'border-none'}>
                {tableHeads.map((head) =>{
                    return <th className={'border-none'}>{head}</th>
                })}
            </tr>
            </thead>
            <tbody>
            {tableRows.map((row) => {
                return <tr>
                    {hasHeaderCol ? row.map((data, i) =>{
                        if(i === 0){
                            return <th>{data}</th>
                        }return <td>{data}</td>
                    }) : row.map((data) =>{
                        return <td>{data}</td>
                    })}
                </tr> })}

            </tbody>
        </table>
    )
}