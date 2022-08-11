import {Doughnut, PolarArea} from "react-chartjs-2";
import React from "react";

const DoughnutChart = ({data}) =>{
    return (
        <div>
            <Doughnut
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        callbacks: {
                            labelColor: (context) =>{
                                return {
                                    borderWidth: 0
                                }
                            }
                        },
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


export default DoughnutChart