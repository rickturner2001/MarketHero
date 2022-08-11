import DoughnutChart from "./DoughtnutChart";
import BarChart from "./BarChart";

export const SectorsSpreadChart = ({sectorsData}) => {

    const counts = {};
    for (const sector of sectorsData) {
        counts[sector] = counts[sector] ? counts[sector] + 1 : 1;
    }

    const data = {
        labels: Object.keys(counts).map((sector) =>{
            return sector
        }),
        datasets: [{
            label: 'My First Dataset',
            data: Object.keys(counts).map(sector => {
                return counts[sector]

            }),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }

    return(
        <DoughnutChart data={data}/>
    )
}