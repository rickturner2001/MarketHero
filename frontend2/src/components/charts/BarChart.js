import {Bar} from "react-chartjs-2";
import React from "react";

const BarChart = ({data, text}) =>{
    return (
        <div>
            <Bar
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Changes in the SP500"
                        },
                    }
                }}
            />
        </div>
    );
};


export default BarChart