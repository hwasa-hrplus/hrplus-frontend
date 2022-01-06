import { PieChart, Pie, Tooltip, Cell, Legend} from 'recharts';
import React, { Component } from 'react';
import TotalEmployeeTable from './TotalEmployeeTable';
import {DepartmentData} from './data';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB6512', '#CC1234', '#GG5789', '#8884d8'];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
      return (
        <div className="customTooltip">
          <p className="info">{`${payload[0].name} 인원: ${payload[0].value}명`}</p>
        </div>
      );
    }
    return null;
};

class DepartmentChart extends Component {
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
                    <PieChart width={1000} height={600} onMouseEnter={this.onPieEnter}>
                        <Pie
                        data={DepartmentData}
                        cx={500}
                        cy={250}
                        innerRadius={120}
                        outerRadius={200}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        onClick={this.findTableByChartClick}
                        >   
                        {DepartmentData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                dataKey
                            />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip/>} />
                        <Legend verticalAlign='middle' align='right' width={150}/>
                    </PieChart>
                </div>
                <div>
                    {/* Table */}
                    {
                    this.state.isDataClick ? 
                    <TotalEmployeeTable dataName={this.state.dataName} dataValue={this.state.dataValue} /> : 
                    ""
                    }
                </div>
            </div>
        );
    }
}

export default DepartmentChart;