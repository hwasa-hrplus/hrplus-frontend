import { PieChart, Pie, Tooltip, Cell, Legend} from 'recharts';
import React, { Component } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@material-ui/core';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', 
                '#FF8042', '#AB6512', '#CC1234', 
                '#GG5789', '#DD8438', '#BB1213', 
                '#EE6619', '#EE1688', '#CC7713', ];

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
    constructor(props){
        super(props);
        this.state=({
          isLoaded : true,
          isDataClick : false,
          dataName: "",
          dataValue: "",
          employeeData: [],
          uniqueDataState: [],
        });
    }

    findTableByChartClick = (data) => {
        console.log('차트 클릭 함수 내 data: ', data);
        
        this.setState({
            isDataClick: true,
            dataName: data.name,
            dataValue: data.value,
        })
        console.log(`${this.state.dataName} 차트 조각 클릭!`);
        
    }

    getMyData = async () => {
        let employeeData = await axios.get('/api/v1/hradmin/admin/list');
        this.setState({
            employeeData: employeeData.data
        }); 

        let uniqueDataNameSet = new Set();
        for (let idx = 0; idx < this.state.employeeData.length; idx++) {
            const departmentName = this.state.employeeData[idx].department.name;
            if (!uniqueDataNameSet.has(departmentName)){
                uniqueDataNameSet.add(departmentName);
            } else {
                continue;
            }
        }

        let uniqueDataNameArr = Array.from(uniqueDataNameSet);
        let uniqueDataset = [];
        for (let idx = 0; idx < uniqueDataNameArr.length; idx++){
            let cnt = this.state.employeeData.filter(data =>
                uniqueDataNameArr[idx] === data.department.name).length;
            console.log(`${uniqueDataNameArr[idx]} 부서: ${cnt}명`);
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        console.log("uniqueDataset: ", uniqueDataset);
        this.setState({uniqueDataState: uniqueDataset});
        console.log("uniqueDataState: ", this.state.uniqueDataState);
    };


    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.getMyData();
            this.setState({isLoaded : false});

        } 
        
        return (
            <div className="ContentWrapper">
                <div className='ChartWrapper'>
                    <div>
                        <PieChart width={1000} height={600} onMouseEnter={this.onPieEnter} style = {{flexDirection: 'row'}}>
                            <Pie 
                            data={this.state.uniqueDataState}
                            cx={300}
                            cy={250}
                            innerRadius={120}
                            outerRadius={200}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            onClick={this.findTableByChartClick}
                            >   
                            {this.state.uniqueDataState.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                    dataKey
                                />
                            ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip/>} />
                            <Legend verticalAlign='middle' align='right' width={550}/>
                        </PieChart>
                    </div>

                </div>
                <div className="TableWrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>사번</TableCell>
                                <TableCell align='center'>부서</TableCell>
                                <TableCell align='center'>직급</TableCell>
                                <TableCell align='center'>직무</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.employeeData.filter((data) =>{
                                    if (data.department.name.includes(this.state.dataName) && this.state.dataName){
                                        return data;
                                    }
                                    else{
                                        return "";
                                    }
                                }).map((filteredData) => { 
                                    return (
                                        <TableRow>
                                            <TableCell align='center'>{filteredData.id}</TableCell>
                                            <TableCell align='center'>{filteredData.department.name}</TableCell>
                                            <TableCell align='center'>{filteredData.stafflevel.level}</TableCell>
                                            <TableCell align='center'>{filteredData.jobCategory.name}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default DepartmentChart;