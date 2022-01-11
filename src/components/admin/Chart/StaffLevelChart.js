import React, { Component } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Input, FormControl, InputLabel, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';

const departmentHead = "Smart융합사업실";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB6512', '#CC1234', '#8884d8'];
const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {        
      return (
        <div className="customTooltip">
          <p className="info">{`${payload[0].payload.name}, 인원: ${payload[0].value}명`}</p>
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
          dataName: "",
          dataValue: "",
          employeeData: [],
          uniqueDataState: [],
          searchingKeyword: "사원 이름을 입력하세요.",
        });
    }

    findTableByChartClick = (data) => {
        console.log('차트 클릭 함수 내 data: ', data);
        
        this.setState({
            dataName: data.name,
            dataValue: data.value,
            searchingKeyword: "사원 이름을 입력하세요.",
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
            } else if (a > b){
                return 1;
            } else {
                return 0;
            }
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

            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        
        this.setState({uniqueDataState: uniqueDataset});
        
    };

    searchingKeywordInput = () => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.getMyData();
            this.setState({isLoaded : false});
        }
        return (
            <div>
                <div >
                    <h1 align='center'>{departmentHead} 직무별 사원 현황</h1>
                </div>
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
                    <div>
                    <div className="SearchBarWrapper" align="center" style={{padding: "20px"}}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                            사원 이름으로 조회
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                // value={this.state.searchingKeyword}
                                onChange={this.searchingKeywordInput('searchingKeyword')}
                                placeholder='사원 이름을 입력하세요.'
                                onFocus={this.placeholder=""}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                                />
                        </FormControl>
                    </div>
                    <div>
                        <h3>선택 직급: {this.state.dataName ? this.state.dataName : "None"}</h3>
                    </div>
                </div>
                <div className="TableWrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>사번</TableCell>
                                <TableCell align='center'>성명</TableCell>
                                <TableCell align='center'>부서</TableCell>
                                <TableCell align='center'>직급</TableCell>
                                <TableCell align='center'>직무</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                this.state.employeeData.filter((data) =>{
                                    if (this.state.searchingKeyword === "사원 이름을 입력하세요." && data.stafflevel.name === this.state.dataName && this.state.dataName){
                                        console.log('클릭로직');
                                        console.log('data.stafflevel.name: ', data.stafflevel.name);
                                        return data;
                                    }
                                    else if (data.stafflevel.name.includes(this.state.dataName) && data.korName.toLowerCase().includes(this.state.searchingKeyword.toLowerCase())){
                                        console.log('검색로직');
                                        return data;
                                    }
                                    else {
                                        return "";
                                    }
                                }).map((filteredData) => { 
                                    console.log('filteredData: ', filteredData);
                                    
                                    return (
                                        <TableRow>
                                            <TableCell align='center'>{filteredData.id}</TableCell>
                                            <TableCell align='center'>{filteredData.korName}</TableCell>
                                            <TableCell align='center'>{filteredData.department.name}</TableCell>
                                            <TableCell align='center'>{filteredData.stafflevel.name}</TableCell>
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