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

        let employeeData = await axios.get('/api/v1/hrmaster/hradmin/list', { headers: authHeader() });
        this.setState({
            employeeData: employeeData.data,
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
                    <h1 align='center'>{departmentHead} 전체 사원 목록</h1>
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
                                        <TableCell align='center'><Link to={`/admin/detail/${data.id}`}>{data.id}</Link></TableCell>
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
                            ))}
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