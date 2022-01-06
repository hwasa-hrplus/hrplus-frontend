import React, { Component } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import TotalEmployeeTable from './TotalEmployeeTable';
import {StaffLevelData} from './data';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB6512', '#CC1234', '#8884d8'];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {        
      return (
        <div className="customTooltip">
          <p className="info">{`${payload[0].payload.name}, 인원: ${payload[0].payload.value}명`}</p>
        </div>
      );
    }
    return null;
};

class StaffLevelChart extends Component {
    constructor(){
        super();
        this.state=({
          isDataClick : false,
          dataName: "",
          dataValue: "",
        });
    }

    findTableByChartClick = (data) => {
        this.setState({
            isDataClick: true,
            dataName: data.name,
            dataValue: data.value,
        })
    }

    render() {
        return (
            <div>
                <div className='pieChartWrapper'>
                    <BarChart width={1000} height={400} data={StaffLevelData} layout = 'horizontal'>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip content={<CustomTooltip/>} />
                        <Legend />
                        <Bar dataKey="value" onClick={this.findTableByChartClick}>
                        {StaffLevelData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                dataKey
                            />
                        ))}
                        </Bar>
                    </BarChart>
                </div>
                <div>
                    {/* Table */}
                    {this.state.isDataClick ? 
                    <TotalEmployeeTable dataName={this.state.dataName} dataValue={this.state.dataValue} /> : 
                    ""}

                </div>
            </div>
        );
    }
}

export default StaffLevelChart;