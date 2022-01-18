//
import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';
import authHeader from '../../../services/auth-header';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { paginate } from './pagination/paginate';

const departmentHead = "Smart융합사업실";
const pageSize = 20;

class EmployeeTable extends Component {
    constructor(props){
        super(props);
        this.state=({
          employeeData: [],
          searchingKeyword: "사원 이름을 입력하세요.",
          pagedData: [],
          currentPage: 1,
          dataNum: 0,
        });
    }

    requestData = async () => {
        let employeeArray = []
        let employeeData = await axios.get('/api/v1/hrmaster/hradmin/list', { headers: authHeader() });
        let projectData = await axios.get('/api/v1/biztrip/project/employee', { headers: authHeader() });
        let mergedEmployeeData = _.merge({}, employeeData.data, projectData.data);

        console.log(mergedEmployeeData)
        for (let index = 0; index < employeeData.data.length; index++) {
            employeeArray.push(mergedEmployeeData[index]);
        }

        employeeArray = employeeArray.filter((data)=>{
            return data.departmentName.includes(departmentHead);
        });

        this.setState({
            employeeData: employeeArray
        });
        this.countData();
    };

    searchingKeywordInput = (prop) => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    countData = () => {
        this.setState({dataNum: this.state.employeeData.length});
        this.handlePageChange(this.state.currentPage);
    }

    handlePageChange = (page) => {
        page = (page === undefined ? 1 : page);
        this.setState({
            currentPage: page,
            pagedData: paginate(this.state.employeeData, page, pageSize),
        });
        sessionStorage.setItem('currentPage', page)
        console.log('current page in handlePageChange: ', this.state.currentPage);
    }

    handlePagedData = () => {
        return paginate(this.searchEmployee(), this.state.currentPage, pageSize);
    }

    setPage = () => {
        if(sessionStorage.currentPage) {
            this.setState({ currentPage : Number(sessionStorage.currentPage) })
            console.log('Number(sessionStorage.currentPage): ', Number(sessionStorage.currentPage));
            return Number(sessionStorage.currentPage);
        }
        this.setState({ currentPage : 1 })
        return 1;
    }

    searchEmployee = () => {
        let filteredData = this.state.employeeData.filter((data) =>{
            if (data.korName.toLowerCase().includes(this.state.searchingKeyword.toLowerCase())){
                console.log('검색로직');
                return data;
            } else if (this.state.searchingKeyword==="사원 이름을 입력하세요." || this.state.searchingKeyword === "") {
                return data;
            } else {
                return "";
            }
        })
        return filteredData;
    }

    componentWillMount(){
        this.requestData();
        this.setPage();
        
    }

    render() {
        return (
            <>
                <div >
                    <h2 align='center' style={{padding: 20}}>{departmentHead} 전체 사원 목록</h2>
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
                                        <TableCell align='center'>{data.workType === true ? "근무자" : "휴직자"}</TableCell>
                                    </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                    
                </div>
                <nav>
                    <ul className="pagination" class="nav justify-content-center bg-light">
                        { 
                            _.range(1, Math.ceil(this.searchEmployee().length / pageSize) + 1).map(page => (
                            <li 
                                key={page} 
                                className={page === this.state.currentPage ? "page-item active" : "page-item"} // Bootstrap을 이용하여 현재 페이지를 시각적으로 표시
                                style={{ cursor: "pointer" }}>
                                <a className="page-link" onClick={() => this.handlePageChange(page)}>{page}</a> {/* 페이지 번호 클릭 이벤트 처리기 지정 */}
                            </li>
                        ))}
                    </ul>
                </nav>
            </>
        );
    }
}

export default EmployeeTable;