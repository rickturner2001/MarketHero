import {Line} from "react-chartjs-2";
import React from "react";

const BarChart = ({data, text, yLabels}) =>{

    return (
            <Line
                type={'line'}
                data={data}
                options={{
                    scales: {
                       x: {
                           ticks: {
                               callback: function(val, index){
                                   return index % 10 === 0 ? this.getLabelForValue(val): ""
                               }
                           }
                       },

                        y: yLabels,
                    },

                    elements:{
                        point: {
                            radius: 0,
                            backgroundColor: "rgba(100, 99, 132, 0.5)"
                        }
                    },

                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: text
                        },
                    }
                }}
            />
    );
};




export default BarChart