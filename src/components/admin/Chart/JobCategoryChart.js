//
import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import './ChartCSS.css';
import _ from 'lodash';
import { paginate } from './pagination/paginate';
import {departmentHead, pageSize} from './commonData';
import authHeader from '../../../services/auth-header';
import {Tooltip} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#4f07eb', '#ea331d', '#ffea28', 
                        '#00C49F', '#eb0eca', '#a8d790', 
                        '#00ba25', '#ea33f2', '#2fd7f2', 
                        '#EE6619', '#ee1688', '#CC7713',
                        '#6bfb00', '#BB1213', '#f8d790', ];

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
        return (
        <div className="customTooltip">
            <p className="info">{`${payload[0].name}(${payload[0].value}명)`}</p>
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
          pagedData: [],
          filteredPagedData: [],
          currentPage: 1,
          dataNum: 0,
        });
    }

    findTableByChartClick = (data) => {
        console.log('차트 클릭 함수 내 data: ', data);
        this.setState({
            dataName: data.name,
            dataValue: data.value,
            searchingKeyword: "사원 이름을 입력하세요.",
            currentPage: 1
        })
        console.log(`${this.state.dataName} 차트 조각 클릭!`);
    }

    findTableByLegendColorClick = (event) => {
        this.setState({
            dataName: event.target.dataset.name,
            dataValue: event.target.dataset.value,
            searchingKeyword: "사원 이름을 입력하세요.",
            currentPage: 1
        })
        console.log('event.target.getAttribute("data-value"):', event.target.dataset.name);
        
    }

    requestData = async () => {
        let employeeArray = []
        let employeeData = await axios.get('/api/v1/hrmaster/hradmin/list', { headers: authHeader() });
        let projectData = await axios.get('/api/v1/biztrip/project/employee', { headers: authHeader() });
        let mergedEmployeeData = _.merge({}, employeeData.data, projectData.data);
        
        for (let index = 0; index < employeeData.data.length; index++) {
            employeeArray.push(mergedEmployeeData[index]);
        }

        // employeeArray = employeeArray.filter((data)=>{
        //     return data.departmentName.includes(departmentHead);
        // });

        // 직급순 데이터 정렬
        let employeeDataSorted = this.sortByStaffLevel(employeeArray).sort( (a, b) => {
            a = a.staffLevel;
            b = b.staffLevel; 
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
            const jobName = this.state.employeeData[idx].jobCategoryName;
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
                uniqueDataNameArr[idx] === data.jobCategoryName).length;
            
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        this.setState({
                       uniqueDataState: uniqueDataset,
                       dataName: uniqueDataset[0].name
                    });
    }

    sortByStaffLevel = (employeeData) => {
        employeeData.staffLevel = "";
        for (let index = 0; index < employeeData.length; index++) {
            
            switch(employeeData[index].staffLevelName){
                case "사원":
                    employeeData[index].staffLevel =  "PLC001";
                    
                    break;
                case "대리":
                    employeeData[index].staffLevel = "PLC002";
                    break;

                case "과장":
                    employeeData[index].staffLevel = "PLC003";
                    break;

                case "차장":
                    employeeData[index].staffLevel = "PLC004";
                    break;

                case "리더":
                    employeeData[index].staffLevel = "PLC005";
                    break;

                case "부장":
                    employeeData[index].staffLevel = "PLC006";
                    break;

                case "상무보":
                    employeeData[index].staffLevel = "PLC007";
                    break;

                default:
                    break;
            }
        }
        return employeeData;
    }

    searchingKeywordInput = () => (event) => {
        this.setState({
            searchingKeyword : event.target.value,
            currentPage: 1
        });
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    handlePageChange = (page) => {
        page = (page === undefined ? 1 : page);
        this.setState({
            currentPage: page,
            pagedData: paginate(this.state.employeeData, page, pageSize),
        });
    }

    handleClick = () => {
        let filteredData = this.state.employeeData.filter((data) =>{                   
            if (this.state.searchingKeyword === "사원 이름을 입력하세요." && data.jobCategoryName === this.state.dataName && this.state.dataName){
                console.log('클릭로직');
                return data;
            } else if (data.jobCategoryName.includes(this.state.dataName) && data.korName.includes(this.state.searchingKeyword)){
                console.log('검색로직');
                return data;
            } else {
                return "";
            }
        })
        console.log('filteredData Length: ', filteredData.length);
        
        return filteredData;
    }

    handlePagedData = () => {
        return paginate(this.handleClick(), this.state.currentPage, pageSize);
    }

    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.requestData();
            this.setState({isLoaded : false});
        }

        return (
            <div>
                <div >
                    <h2 align='center' style={{padding: 20}}>{departmentHead} 직무별 사원 현황</h2>
                </div>
                <div className="ContentWrapper">
                    <div className='ChartWrapper'>
                        <div>
                            <PieChart width={700} height={480} onMouseEnter={this.onPieEnter} style = {{flexDirection: 'row'}}>
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
                                        width: 800,
                                        height: 30
                                        }}>
                                        <button style={{ 
                                                        backgroundColor: COLORS[index],
                                                        width: 50
                                                    }}
                                                data-name={data.name}
                                                data-value={data.value}
                                                onClick={this.findTableByLegendColorClick}
                                        >{" "}</button>
                                        <button size='large' style={{
                                            justifyContent: 'left',
                                            width: 470,
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
                    <h3 style={{padding: 20}}>선택 직무: {this.state.dataName ? this.state.dataName.replace(departmentHead+" ", "") : "None"}</h3>
                </div>
                <div className="TableWrapper">
                <Table style={{width: 1500}} >
                        <TableHead>
                        <TableRow style={{height: 35}}>
                                <TableCell style={{width: 70, backgroundColor: '#A9A9A9', color:'white'}} align='center'><b>사번</b></TableCell>
                                <TableCell style={{width: 80, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>성명</b></TableCell>
                                <TableCell style={{width: 80, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>직급</b></TableCell>
                                <TableCell style={{width: 65, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>직책</b></TableCell>
                                <TableCell style={{width: 400, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>부서</b></TableCell>
                                <TableCell style={{width: 150, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>직무</b></TableCell>
                                <TableCell style={{width: 400, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>프로젝트</b></TableCell>
                                <TableCell style={{width: 80, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>이메일</b></TableCell>
                                {/* <TableCell style={{width: 130}} align='center'>휴대전화</TableCell> */}
                                <TableCell style={{width: 90, backgroundColor: '#A9A9A9', color: 'white'}} align='center'><b>근무형태</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                this.handlePagedData().map((data) => (
                                    <TableRow>
                                        <TableCell align='center' color="blue"><Link to={`/admin/detail/${data.id}`}>{data.id}</Link></TableCell>
                                        <TableCell align='center'>{data.korName}</TableCell>
                                        <TableCell align='center'>{data.staffLevelName}</TableCell>
                                        <TableCell align='center'>{data.role}</TableCell>
                                        <TableCell align='center'>{data.departmentName.replace(departmentHead+" ", "")}</TableCell>
                                        <TableCell align='center'>{data.jobCategoryName}</TableCell>
                                        <TableCell align='center'>{data.code}</TableCell>
                                        <TableCell align='center'>{data.email}</TableCell>
                                        {/* <TableCell align='center'>{data.phone}</TableCell> */}
                                        <TableCell align='center'>{data.workType === false ? "근무" : "휴직"}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <nav>
                    {
                    <ul className="pagination" class="nav justify-content-center bg-light">
                        {
                            _.range(1, Math.ceil(this.handleClick().length / pageSize) + 1).map(page => (
                            <li 
                                key={page} 
                                className={page === this.state.currentPage ? "page-item active" : "page-item"}
                                style={{ cursor: "pointer" }}>
                                <a className="page-link" onClick={() => this.handlePageChange(page)}>{page}</a>
                            </li>
                        ))}
                    </ul>
                    }
                </nav>
            </div>
        </div>

        );
    }
}

export default JobCategoryChart;