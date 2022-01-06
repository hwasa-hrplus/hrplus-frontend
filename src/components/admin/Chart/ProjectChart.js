import { Button } from '@mui/material';
import React, { Component } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend} from 'recharts';
import TotalEmployeeTable from './TotalEmployeeTable';
import {ProjectData} from './data';
import './ChartCSS.css';



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
                <div className='ChartWrapper'>
                    <PieChart width={1000} height={600} onMouseEnter={this.onPieEnter}>
                        <Pie
                            data={ProjectData}
                            cx={500}
                            cy={250}
                            innerRadius={120}
                            outerRadius={200}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            onClick={this.findTableByChartClick}
                        >   
                        {ProjectData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                dataKey
                            />
                        ))}
                        </Pie>
                        <Legend verticalAlign='middle' align='right' width={150}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend/>
                    </PieChart>
                    <div className='LegendButtonWrapper'>
                        {
                        ProjectData.map((entry, index) => (
                            <Button className='LegendButton'
                                    style={{
                                        fontSize: "medium",
                                        margin: "5%"
                                        }}>
                                {entry.name} ({entry.value}명)
                            </Button>
                        ))}

                    </div>
                    
                </div>
                <div>
                    
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

export default ProjectChart;