import React, { Component } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Input, FormControl } from '@material-ui/core';
import axios from 'axios';


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
    constructor(props){
        super(props);
        this.state=({
          isLoaded : true,
          isDataClick : false,
          dataName: "",
          dataValue: "",
          employeeData: [],
          uniqueDataState: [],
          searchData: ""
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
        // 직급순 데이터 정렬
        let employeeDataSorted = employeeData.data.sort( (a, b) => {
            a = a.stafflevel.level;
            b = b.stafflevel.level; 
            if (a < b){
                return -1;
            }
            if (a > b){
                return 1;
            }
            return 0;
        });

        this.setState({
            employeeData: employeeDataSorted
        }); 
        
        let uniqueDataNameSet = new Set();
        for (let idx = 0; idx < this.state.employeeData.length; idx++) {
            const staffLevelName = this.state.employeeData[idx].stafflevel.name;
            if (!uniqueDataNameSet.has(staffLevelName)){
                uniqueDataNameSet.add(staffLevelName);
            } else {
                continue;
            }
        }
        
        let uniqueDataNameArr = Array.from(uniqueDataNameSet);
        let uniqueDataset = [];
        for (let idx = 0; idx < uniqueDataNameArr.length; idx++){
            let cnt = this.state.employeeData.filter(data =>
                uniqueDataNameArr[idx] === data.stafflevel.name).length;
            console.log(`${uniqueDataNameArr[idx]} 직급: ${cnt}명`);
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        console.log("uniqueDataset: ", uniqueDataset);
        this.setState({uniqueDataState: uniqueDataset});
        console.log("uniqueDataState: ", this.state.uniqueDataState);
    };

    searchEmployee = (searchInputData) =>{
        console.log('searchInputData: ', searchInputData);
        
    }

    handleChange = (event) => {
        this.setState({searchData: event.target.value});
        console.log(`searchData: ${this.state.searchData}`);
        
    };
    

    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.getMyData();
            this.setState({isLoaded : false});
        } 
        return (
            <div>
                <div className='pieChartWrapper'>
                    <BarChart width={1000} height={400} data={this.state.uniqueDataState} layout = 'horizontal'>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip content={<CustomTooltip/>} />
                        {/* <Legend /> */}
                        <Bar dataKey="value" onClick={this.findTableByChartClick}>
                        {this.state.uniqueDataState.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                dataKey
                            />
                        ))}
                        </Bar>
                    </BarChart>
                </div>
                <div className="SearchBarWrapper">
                    {/* /onClick={} */}
                    <TextField id="searchBox" label="사원 조회" variant="outlined" onClick={this.searchEmployee}/>
                    <FormControl variant="standard">
                        <Input
                            id="component-helper"
                            value={this.state.searchData}
                            onChange={this.handleChange}
                            aria-describedby="component-helper-text"
                            />
                    </FormControl>
                    
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
                                    if (data.stafflevel.name.includes(this.state.dataName) && this.state.dataName){
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

export default StaffLevelChart;