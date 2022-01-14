//
import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import _ from 'lodash';
import { paginate } from './pagination/paginate';
import {departmentHead, pageSize, COLORS} from './commonData'

const CustomTooltip = ({ active, payload, name }) => {
    if (active && payload && payload.length) {
        return (
        <div className="customTooltip">
            <p className="info">{`${payload[0].name.replace(departmentHead, "")} 인원: ${payload[0].value}명`}</p>
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
        let employeeData = await axios.get('/api/v1/hrmaster/hradmin/admin/list');
        
        employeeData = employeeData.data.filter((data)=>{
            return data.departmentName.includes(departmentHead);
        });
        
        // 직급순 데이터 정렬
        let employeeDataSorted = this.sortByStaffLevel(employeeData).sort( (a, b) => {
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
            const departmentName = this.state.employeeData[idx].departmentName;
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
                uniqueDataNameArr[idx] === data.departmentName).length;
            console.log(`${uniqueDataNameArr[idx]} 부서: ${cnt}명`);
            let uniqueObj = {};
            uniqueObj.name = uniqueDataNameArr[idx];
            uniqueObj.value = cnt;
            uniqueDataset.push(uniqueObj);
        }
        this.setState({uniqueDataState: uniqueDataset});
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
            if (this.state.searchingKeyword === "사원 이름을 입력하세요." && data.departmentName === this.state.dataName && this.state.dataName){
                console.log('클릭로직');
                return data;
            }
            else if (data.departmentName.includes(this.state.dataName) && data.korName.includes(this.state.searchingKeyword)){
                console.log('검색로직');
                return data;
            }
            else {
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
            this.requestData();
            this.setState({isLoaded : false});
        }

        return (
            <div>
                <div >
                    <h1 align='center'>{departmentHead} 부서별 사원 현황</h1>
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
                                <Tooltip content={<CustomTooltip/>} />
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
                                                
                                            <button style={{ backgroundColor: COLORS[index],
                                                            width: 50
                                                            }}
                                                    data-name={data.name}
                                                    data-value={data.value}
                                                    onClick={this.findTableByLegendColorClick}
                                            >{" "}</button>
                                            <button size='large' style={{
                                                justifyContent: 'left',
                                                width: 450,
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
                        <h3 style={{padding: 10}}>선택 부서: {this.state.dataName ? this.state.dataName.replace(departmentHead+" ", "") : "None"}</h3>
                    </div>
                </div>
                <div className="TableWrapper">
                    <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell style={{width: 80}} align='center'>사번</TableCell>
                            <TableCell style={{width: 90}} align='center'>성명</TableCell>
                            <TableCell style={{width: 80}} align='center'>직급</TableCell>
                            <TableCell style={{width: 80}} align='center'>직책</TableCell>
                            <TableCell style={{width: 400}} align='center'>부서</TableCell>
                            <TableCell style={{width: 120}} align='center'>직무</TableCell>
                            <TableCell style={{width: 180}} align='center'>프로젝트</TableCell>
                            <TableCell style={{width: 100}} align='center'>이메일</TableCell>
                            <TableCell style={{width: 150}} align='center'>휴대전화</TableCell>
                            <TableCell style={{width: 100}} align='center'>근무형태</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        { 
                            this.handlePagedData().map((data) => (
                                <TableRow>
                                    <TableCell align='center'>{data.id}</TableCell>
                                    <TableCell align='center'>{data.korName}</TableCell>
                                    <TableCell align='center'>{data.staffLevelName}</TableCell>
                                    <TableCell align='center'>{data.role}</TableCell>
                                    <TableCell align='center'>{data.departmentName.replace(departmentHead+" ", "")}</TableCell>
                                    <TableCell align='center'>{data.jobCategoryName}</TableCell>
                                    <TableCell align='center'>{data.workPlaceName}</TableCell>
                                    <TableCell align='center'>{data.email}</TableCell>
                                    <TableCell align='center'>{data.phone}</TableCell>
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
        );
    }
}

export default DepartmentChart;