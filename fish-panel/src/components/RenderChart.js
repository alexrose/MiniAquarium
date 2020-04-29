import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

function RenderChart(props) {
    let data = (props.time === "day") ? props.data.day : props.data.night;
    return (
        <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[24, 25]} />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="temperature" dot={false} />
        </LineChart>
    )
}
export default RenderChart;