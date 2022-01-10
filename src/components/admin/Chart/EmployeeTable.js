import { FormControl, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import React, { Component } from 'react';

const departmentHead = "Smart융합사업실";

class EmployeeTable extends Component {
    constructor(){
        super();
        this.state=({
          employeeData: [],
          searchingKeyword: "",
        });
    }

    requestData = async () => {
        let employeeData = await axios.get('/api/v1/hradmin/admin/list');
        this.setState({
            employeeData: employeeData.data,
        }); 
    };

    searchingKeywordInput = (prop) => (event) => {
        this.setState({searchingKeyword : event.target.value});
        console.log('searchingKeyword: ', this.state.searchingKeyword);
    };

    render() {
        this.requestData();
        return (
            <>
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
                                <TableCell style={{width: 100}} align='center'>사번</TableCell>
                                <TableCell style={{width: 100}} align='center'>성명</TableCell>
                                <TableCell style={{width: 400}} align='center'>부서</TableCell>
                                <TableCell style={{width: 100}} align='center'>직급</TableCell>
                                <TableCell style={{width: 100}} align='center'>직무</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                this.state.employeeData.filter((data) =>{
                                    if (data.korName.includes(this.state.searchingKeyword)){
                                        return data;
                                    }
                                    else {
                                        return "";
                                    }
                                }).map((filteredData) => { 
                                    console.log('filteredData: ', filteredData);
                                    if (filteredData){
                                        return (
                                            <TableRow>
                                                <TableCell align='center'>{filteredData.id}</TableCell>
                                                <TableCell align='center'>{filteredData.korName}</TableCell>
                                                <TableCell align='center'>{filteredData.department.name.replace(departmentHead+" ", "")}</TableCell>
                                                <TableCell align='center'>{filteredData.stafflevel.name}</TableCell>
                                                <TableCell align='center'>{filteredData.jobCategory.name}</TableCell>
                                            </TableRow>
                                        );
                                    } else {
                                        return (
                                        <TableRow>
                                            <TableCell align='center'>&nbsp;</TableCell>
                                            <TableCell align='center'>&nbsp;</TableCell>
                                            <TableCell align='center'>&nbsp;</TableCell>
                                            <TableCell align='center'>&nbsp;</TableCell>
                                            <TableCell align='center'>&nbsp;</TableCell>
                                        </TableRow>);
                                    }
                                    
                                })
                            }
                        </TableBody>
                    </Table>

                </div>
            </>
        );
    }
}

export default EmployeeTable;