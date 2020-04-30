import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

function RenderChart(props) {

    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <LineChart data={props.data} >
                <CartesianGrid />
                <XAxis dataKey={props.xKey} />
                <YAxis domain={[24, 25]} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line name={props.name} type="monotone" dataKey={props.yKey} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}
export default RenderChart;