import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

function RenderChart(props) {
    let data = (props.time === "day") ? props.data.day : props.data.night;
    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[24, 25]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}
export default RenderChart;