import React, { Component } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableHead, TableBody, TableRow, TableCell, Input, FormControl, InputLabel, InputAdornment } from '@material-ui/core';
import axios from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';
import _ from 'lodash';
import { paginate } from './Pagination/paginate';

const departmentHead = "Smart융합사업실";
const pageSize = 50;
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
        })
        console.log(`${this.state.dataName} 차트 조각 클릭!`);
        // this.handleClick();
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
        // this.countData();
        // this.handlePageChange();
    };

    searchingKeywordInput = () => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
        // this.handleClick();
    };

    countData = () => {
        this.setState({dataNum: this.state.filteredPagedData.length});
    }

    handlePageChange = (page) => {
        page = (page === undefined ? 1 : page);
        this.setState({
            currentPage: page,
            pagedData: paginate(this.state.employeeData, page, pageSize),
        });
    }

    handleClick = () => {
        let filteredData = this.state.employeeData.filter((data) =>{                   
            if (this.state.searchingKeyword === "사원 이름을 입력하세요." && data.stafflevel.name === this.state.dataName && this.state.dataName){
                console.log('클릭로직');
                return data;
            }
            else if (data.stafflevel.name.includes(this.state.dataName) && data.korName.toLowerCase().includes(this.state.searchingKeyword.toLowerCase())){
                console.log('검색로직');
                return data;
            }
            else {
                return "";
            }
        })
        // this.setState({
        //                 filteredPagedData: paginate(filteredData, this.state.currentPage, pageSize),
        //                 dataNum: this.state.filteredPagedData.length});
        return filteredData;
    }

    render() {
        if (this.state.isLoaded){
            console.log('getMyData!');
            this.getMyData();
            this.setState({isLoaded : false});
        }
        return (
            <div>
                <div>
                    <h1 align='center'>{departmentHead} 직무별 사원 현황</h1>
                </div>
                <div className='ChartWrapper' align='center'>
                    <BarChart  style={{ display: "flex", alignItems: "center" }}
                        width={1000} height={400} data={this.state.uniqueDataState} layout = 'horizontal'>
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
                        paginate(this.handleClick(), this.state.currentPage, pageSize).map((data) => (
                                <TableRow>
                                    <TableCell align='center'>{data.id}</TableCell>
                                    <TableCell align='center'>{data.korName}</TableCell>
                                    <TableCell align='center'>{data.stafflevel.name}</TableCell>
                                    <TableCell align='center'>{data.role === 'ROLE_MEMBER' ? "팀원" : "팀장"}</TableCell>
                                    <TableCell align='center'>{data.department.name.replace(departmentHead+" ", "")}</TableCell>
                                    <TableCell align='center'>{data.jobCategory.name}</TableCell>
                                    <TableCell align='center'>{data.workPlace.name}</TableCell>
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
                        { _.range(1, Math.ceil(paginate(this.handleClick(), this.state.currentPage, pageSize).length / pageSize) + 1).map(page => (
                            <li 
                                key={page} 
                                className={page === this.state.currentPage ? "page-item active" : "page-item"} // Bootstrap을 이용하여 현재 페이지를 시각적으로 표시
                                style={{ cursor: "pointer" }}>
                                <a className="page-link" onClick={() => this.handlePageChange(page)}>{page}</a> {/* 페이지 번호 클릭 이벤트 처리기 지정 */}
                            </li>
                        ))}
                    </ul>
                    }
                </nav>
            </div>
        );
    }
}

export default StaffLevelChart;