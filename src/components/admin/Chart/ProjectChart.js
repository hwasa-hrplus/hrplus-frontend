import React, { Component } from 'react';
import { PieChart, Pie, Tooltip, Cell} from 'recharts';

const data = [
    { name: 'Project A', value: 400 },
    { name: 'Project B', value: 300 },
    { name: 'Project C', value: 100 },
    { name: 'Project D', value: 200 },
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

const findTableByClick = (args) => {
    // @경빈
    // - 계획: 클릭된 조각별 사원 정보 조회하는 컴포넌트 출력하도록 구현
    console.log(`${args.name} 조회 클릭!`); 
};

class ProjectChart extends Component {
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
                    onClick={findTableByClick}
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

export default ProjectChart;