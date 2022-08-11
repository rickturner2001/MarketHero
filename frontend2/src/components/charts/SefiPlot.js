import BarChart from "./BarChart";

export const SefiPlot = ({marketData}) => {
    const sefiPlottingData = marketData.plotting.breadth.SEFI.values
    const sefiData = {
        labels: sefiPlottingData.map((data) => {
            const [ticker, d] = data
            if (d > 0)
                return ticker
        }),
        datasets: [
            {
                label: 'Positive change',
                data: sefiPlottingData.map((data) => {
                    const [_, d] = data
                    if (d > 0)
                        return d
                }),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            },
        ]
    }

    return(
        <BarChart data={sefiData}/>
    )
}

export const NegativeSefiPlot = ({marketData}) => {
    const sefiPlottingData = marketData.plotting.breadth.SEFI.values
    const negativeSefi = {

        labels: sefiPlottingData.map((data) => {
            const [ticker, d] = data
            if (d <= 0)
                return ticker
        }),
        datasets: [
            {
                label: 'Negative change',
                data: sefiPlottingData.map((data) => {
                    const [_, d] = data
                    if (d <= 0)
                        return d
                }),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            },
        ]

    }
    return (
        <BarChart data={negativeSefi}/>
    )
}