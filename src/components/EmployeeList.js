import React, { Component } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';

class EmployeeList extends Component {

    constructor(props) {
        super(props);
        console.log('in constructor');
    }

    state = {
        data: []
    };

    getMyData = async () => {
        let data = await axios.get('/api/v1/hradmin/admin/list');
        data = data.data;
        console.log('data is ' + JSON.stringify(data));
        this.setState({data});

    };

    componentDidMount() {
        console.log('in componentDidMount');
        this.getMyData();
    }

    componentDidUpdate() {
        console.log('in componentDidUpdate');
    }

    componentWillUnmount() {
        console.log('in componentWillUnmount');
    }

    render() {

    return (

        <div>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align='center'>사번</TableCell>
                    <TableCell align='center'>이름</TableCell>
                    <TableCell align='center'>직급</TableCell>
                    <TableCell align='center'>직책</TableCell>
                    <TableCell align='center'>부서</TableCell>
                    {/* <TableCell align='center'>프로젝트</TableCell> */}
                    <TableCell align='center'>이메일</TableCell>
                    <TableCell align='center'>휴대전화</TableCell>
                    <TableCell align='center'>근무형태</TableCell>
                </TableRow>
            </TableHead>
        <TableBody>

        {

        this.state.data.map( (EmployeeData, index) =>
            <TableRow>
                <TableCell  key = {index} align='center'>
                <Link to={`/admin/detail/${EmployeeData.id}`}>{EmployeeData.id}</Link>
                </TableCell>
                <TableCell align='center'>{EmployeeData.korName}</TableCell>
                <TableCell align='center'>{EmployeeData.stafflevel.name}</TableCell>
                <TableCell align='center'>{EmployeeData.role}</TableCell>
                <TableCell align='center'>{EmployeeData.department.name}</TableCell>
                {/* <TableCell align='center'>{EmployeeData.project.name}</TableCell> */}
                <TableCell align='center'>{EmployeeData.email}</TableCell>
                <TableCell align='center'>{EmployeeData.phone}</TableCell>
                {EmployeeData.workType === 0 ?
                    <TableCell align='center'>휴직자</TableCell>
                        :<TableCell align='center'>근무자</TableCell>

                }
            </TableRow>

        )}

        </TableBody>
        </Table>
        </div>

    );

    }

    }

export default EmployeeList;