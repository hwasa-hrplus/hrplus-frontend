import React, { Component } from 'react';
import { PieChart, Pie, Tooltip, Cell} from 'recharts';

const data = [
    { code: 'CL1', name:  "사원" },
    { code: 'CL2', name: "대리" },
    { code: 'CL3', name: "과장" },
    { code: 'CL4', name: "차장" },
    { code: 'CL5', name: "리더대우" },
    { code: 'CL6', name: "리더" },
    { code: 'CL7', name: "상무보" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB6512', '#CC1234', '#GG5789'];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
      return (
        <div className="customTooltip">
          <p className="info">{`${payload[0].code} 인원: ${payload[0].name}`}</p>
        </div>
      );
    }
    return null;
};

class StaffLevelChart extends Component {
    render() {
        return (
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
                        onClick={console.log("직급 조각 클릭!")}
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
        );
    }
}

export default StaffLevelChart;