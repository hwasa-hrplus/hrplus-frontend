import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';

const departmentHead = "Smart융합사업실";

class EmployeeTable extends Component {
    constructor(props){
        super(props);
        this.state=({
          employeeData: [],
          searchingKeyword: "사원 이름을 입력하세요.",
          isLoaded: true,
          page: 1,
          limit: 11,
          pageTotal: [],
        });
    }

    requestData = async () => {
        let employeeData = await axios.get('/api/v1/hradmin/admin/list');
        this.setState({
            employeeData: employeeData.data,
        });
        this.pageCount();
        
        
    };

    searchingKeywordInput = (prop) => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    pageCount = () => {
        let pageArrTmp = [];
        for(let i = 1; i <= Math.ceil(this.state.employeeData.length/ this.state.limit); i++) {
            pageArrTmp.push(i);
        }
        this.setState({pageTotal: pageArrTmp});
        console.log("pageTotal: ", this.state.pageTotal);
    }

    changePage = (el) => {
        this.setState({ page : el });
        sessionStorage.setItem('page', el);
    }

    // 새로고침해도 게시판 번호 유지
    setPage = () => {
        if(sessionStorage.page) {
          this.setState({ page : Number(sessionStorage.page) })
          return Number(sessionStorage.page);
        }
        this.setState({ page : 1 })
        return 1;
    }
    
    componentWillMount() {
        this.setPage();
    }

    
    
    render() {
        if (this.state.isLoaded){
            this.requestData();
            this.setState({isLoaded : false});
        }
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
                                this.state.employeeData.filter((data) =>{
                                    if (data.korName.includes(this.state.searchingKeyword) || this.state.searchingKeyword === "사원 이름을 입력하세요."){
                                        return data;
                                    }
                                    else{
                                        return "";
                                    }
                                }).map((filteredData) => { 
                                        return (
                                            <TableRow>
                                                <TableCell align='center'>{filteredData.id}</TableCell>
                                                <TableCell align='center'>{filteredData.korName}</TableCell>
                                                <TableCell align='center'>{filteredData.stafflevel.name}</TableCell>
                                                <TableCell align='center'>{filteredData.role === 'ROLE_MEMBER' ? "팀원" : "팀장"}</TableCell>
                                                <TableCell align='center'>{filteredData.department.name.replace(departmentHead+" ", "")}</TableCell>
                                                <TableCell align='center'>{filteredData.jobCategory.name}</TableCell>
                                                <TableCell align='center'>{filteredData.workPlace.name}</TableCell>
                                                <TableCell align='center'>{filteredData.email}</TableCell>
                                                <TableCell align='center'>{filteredData.phone}</TableCell>
                                                <TableCell align='center'>{filteredData.workType === false ? "근무" : "휴직"}</TableCell>
                                            </TableRow>
                                        );
                                })
                            }
                        </TableBody>
                    </Table>

                </div>
                <div>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>
            </>
        );
    }
}

export default EmployeeTable;