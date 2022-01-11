import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import './ChartCSS.css';

const departmentHead = "Smart융합사업실";
const COLORS = ['#4f07eb', '#00C49F', '#ffea28', 
                '#f78d59', '#eb0eca', '#ff0a2b', 
                '#00ba25', '#DD8438', '#BB1213', 
                '#EE6619', '#ee1688', '#CC7713', ];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
        return (
        <div className="customTooltip">
            <p className="info">{`${payload[0].name}, 인원: ${payload[0].value}명`}</p>
        </div>
        );
    }
    return null;
};
                
class JobCategoryChart extends Component {
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

    findTableByLegendColorClick = (event) => {
        this.setState({
            dataName: event.target.dataset.name,
            dataValue: event.target.dataset.value,
            searchingKeyword: "사원 이름을 입력하세요.",
        })
        console.log('event.target.getAttribute("data-value"):', event.target.dataset.name);
        
    }

    getMyData = async () => {
        let employeeData = await axios.get('/api/v1/hradmin/admin/list');
        
        employeeData = employeeData.data.filter((data)=>{
            return data.department.name.includes(departmentHead);
        });
        
        this.setState({
            employeeData: employeeData
        });       

        let uniqueDataNameSet = new Set();
        for (let idx = 0; idx < this.state.employeeData.length; idx++) {
            const jobName = this.state.employeeData[idx].jobCategory.name;
            if (!uniqueDataNameSet.has(jobName)){
                uniqueDataNameSet.add(jobName);
            } else {
                continue;
            }
        }

        let uniqueDataNameArr = Array.from(uniqueDataNameSet);
        let uniqueDataset = [];
        for (let idx = 0; idx < uniqueDataNameArr.length; idx++){
            let cnt = this.state.employeeData.filter(data =>
                uniqueDataNameArr[idx] === data.jobCategory.name).length;
            
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        this.setState({uniqueDataState: uniqueDataset});
        // this.getRandomColor();
    }

    searchingKeywordInput = (prop) => (event) => {
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
                <div className="ContentWrapper">
                    <div className='ChartWrapper'>
                        <div>
                            <PieChart width={700} height={530} onMouseEnter={this.onPieEnter} style = {{flexDirection: 'row'}}>
                                <Pie 
                                    data={this.state.uniqueDataState}
                                    cx={300}
                                    cy={250}
                                    innerRadius={140}
                                    outerRadius={230}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    onClick={this.findTableByChartClick}
                                >   
                                {this.state.uniqueDataState.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index]}
                                    dataKey
                                />
                                ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                    </div>
                    <div className="LegendWrapper">
                        {
                            this.state.uniqueDataState.map((data, index) => {
                                return (
                                    <div style={{ 
                                        display: 'flex',
                                        alignContent: 'left',
                                        width: 700,
                                        height: 30
                                        }}>
                                        <button style={{ backgroundColor: COLORS[index],
                                                        width: 50
                                                        }}
                                                data-name={data.name}
                                                data-value={data.value}
                                                onClick={this.findTableByLegendColorClick}
                                        >{" "}</button>
                                        <button size='large' style={{
                                            justifyContent: 'left',
                                            width: 370,
                                            backgroundColor: 'white',
                                            textAlign: 'left'
                                        }} className="LegendButton"
                                        data-name={data.name}
                                        data-value={data.value}
                                        onClick={this.findTableByLegendColorClick}>
                                            {`${data.name.replace(departmentHead+" ", "")} (${data.value}명)`}</button>
                                    </div>
                                    );
                            })
                        }
                    </div>
                </div>
                <div className="SearchBarWrapper" align="center" style={{padding: "20px"}}>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                        사원 이름으로 조회
                        </InputLabel>
                        <Input
                            id="input-with-icon-adornment"
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
                    <h3>선택 직무: {this.state.dataName ? this.state.dataName.replace(departmentHead+" ", "") : "None"}</h3>
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
                                    
                                    if (this.state.searchingKeyword === "사원 이름을 입력하세요." && data.jobCategory.name === this.state.dataName && this.state.dataName){
                                        console.log('클릭로직');
                                        return data;
                                    }
                                    else if (data.jobCategory.name.includes(this.state.dataName) && data.korName.toLowerCase().includes(this.state.searchingKeyword.toLowerCase())){
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
                                            <TableCell align='center'>{filteredData.department.name.replace(departmentHead+" ", "")}</TableCell>
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
        </div>

        );
    }
}

export default JobCategoryChart;