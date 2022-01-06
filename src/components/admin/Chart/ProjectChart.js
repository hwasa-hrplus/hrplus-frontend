import React, { Component } from 'react';
import { PieChart, Pie, Tooltip, Cell} from 'recharts';
import TotalEmployeeTable from './TotalEmployeeTable';

const data = [
    { chartName: 'Project', name: 'Project A', value: 400 },
    { chartName: 'Project', name: 'Project B', value: 300 },
    { chartName: 'Project', name: 'Project C', value: 100 },
    { chartName: 'Project', name: 'Project D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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


class ProjectChart extends Component {
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
                    <PieChart width={1000} height={400} onMouseEnter={this.onPieEnter}>
                        <Pie
                            data={data}
                            cx={500}
                            cy={200}
                            innerRadius={120}
                            outerRadius={180}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            onClick={this.findTableByChartClick}
                        >   
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                dataKey
                            />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>
                <div>
                    {/* Table */}
                    {this.state.isDataClick ?  <h1>{this.state.dataName}</h1> : ""}
                </div>

            </div>
        );
    }
}

export default ProjectChart;