import React, {Component} from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

class RenderChart extends Component {

    render() {
        let {name, date, data, xKey, yKey} = this.props;
        name = `${name}(${date})`;

        return (
            <ResponsiveContainer width={'100%'} height={300}>
                <LineChart data={data} >
                    <CartesianGrid />
                    <XAxis dataKey={xKey} />
                    <YAxis domain={[24, 25]} />
                    <Tooltip />
                    <Legend verticalAlign='top' height={36} />
                    <Line name={name} type='monotone' dataKey={yKey} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}

export default RenderChart;