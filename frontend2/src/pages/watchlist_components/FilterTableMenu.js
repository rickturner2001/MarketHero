export const FilterTableMenu = ({tickersInfo}) =>{


    const sectors = Object.keys(tickersInfo).map((ticker) => {
        return tickersInfo[ticker].sector
    });

    const secFilings = Object.keys(tickersInfo).map((ticker) => {
        return tickersInfo[ticker].sec_filings
    });

    const subIndustries = Object.keys(tickersInfo).map((ticker) => {
        return tickersInfo[ticker].sub_industry
    });

    const getCount = (arr) =>{
        const counts = {};
        for (const value of arr) {
            counts[value] = counts[value] ? counts[value] + 1 : 1;
        }
        return counts
    }

    return (
        <div className='flex flex-col'>
            <ul className="menu bg-base-300 w-56 p-2">
                <li className="menu-title">
                    <span>Sector</span>
                </li>
                {Object.keys(getCount(sectors)).map((sector, index) => {
                    return (
                        index < 5 ?
                            <li key={index}><a>{sector}</a></li>
                            :
                            <></>
                    )
                })}
                <li className="menu-title">
                    <span>SEC Filings</span>
                </li>
                {Object.keys(getCount(secFilings)).map((filing, index) => {
                    return (
                        index < 5 ?
                            <li key={index}><a>{filing}</a></li>
                            :
                            <></>

                    )
                })}
                <li className="menu-title">
                    <span>Sub-Industry</span>
                </li>
                {Object.keys(getCount(subIndustries)).map((subInd, index) => {
                    return (
                        index < 5 ?
                            <li key={index}><a>{subInd}</a></li>
                            :
                            <></>
                    )
                })}
            </ul>
            <button className='btn btn-warning'>Confirm</button>
        </div>
    )
}