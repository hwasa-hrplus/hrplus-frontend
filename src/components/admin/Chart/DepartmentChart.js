import { Tooltip } from '@mui/material';
import React, { Component } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const data = [
    { name: 'Smart융합사업기획그룹', value: 123 },
    { name: 'Smart융합사업부', value: 90 },
    { name: 'Smart Logistics사업부', value: 56 },
    { name: 'Smart Construction사업부', value: 35 },
    { name: '포스코Intl사업추진반', value: 77 },
    { name: '공항BHS사업추진반', value: 88 },
    { name: 'RPA사업추진반', value: 27 },
    { name: 'B&C합리화섹션', value: 33 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB6512', '#CC1234', '#GG5789'];

const findTableByClick = (args) => {
    // @경빈
    // - 계획: 클릭된 조각별 사원 정보 조회하는 컴포넌트 출력하도록 구현
    console.log(`${args.name} 조회 클릭!`); 
};


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
                    <Tooltip content={<CustomTooltip/>} />
                </PieChart>
            </div>
        );
    }
}

export default DepartmentChart;