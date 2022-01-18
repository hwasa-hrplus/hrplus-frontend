import React, { Component } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import authHeader from '../../services/auth-header';
import { Button } from '@mui/material';

class ApproveBizTrip extends Component {
    constructor(props) {
        super(props);
        this.handleApprove = this.handleApprove.bind(this);
        console.log('in constructor');
    }

    state = {
        data: [],
        
    };

    getMyData = async () => {
        let firstData = await axios.get('/api/v1/biztrip/unapproved');
        let data=[];
        const myId = authService.getCurrentUser().id;
        
        for (var key in firstData.data) {
           if( firstData.data[key].bossId === myId){
            const employee = await axios.get(`/api/v1/hrmaster/hrfixed/${firstData.data[key].employeeId}`,  { headers: authHeader()});
            firstData.data[key]['korName'] = employee.data.korName;
            firstData.data[key]['staffLevelName'] = employee.data.staffLevelName;
            firstData.data[key].startDate = firstData.data[key].startDate.split('T')[0];
            firstData.data[key].endDate = firstData.data[key].endDate.split('T')[0];

            const employee2 = await axios.get(`/api/v1/hrmaster/hrbasic/${firstData.data[key].employeeId}`,  { headers: authHeader()});
            console.log('~~~~~'+employee2.data.email); 
            firstData.data[key]['email'] = employee2.data.email;
            
            data.push(firstData.data[key]);
            
           }
          
        }

   
        console.log(firstData);
        this.setState({data:data});
           
        
    };

    componentDidMount() {
        console.log('in componentDidMount');
        this.getMyData();
    }

    handleApprove =async (key) =>{        
        let data=this.state.data;
        const id = data[key].id;
        const approveData = {approved:true};
        await axios.put(`/api/v1/biztrip/${id}`, approveData);
        data.splice(key, 1);       
        this.setState(data);

        //console.log('!!!!!!!'+data[key].project.name);
        

        alert('승인완료')
       
        await axios.post('/api/v1/mail/sendApprove'
        ,{
            address:data[key].email,
            name:data[key].korName,
            projectName:data[key].project.name
        })
        .then((res)=>console.log('출장요청자에게 메일발송 완료'))

    }

    handleDelete =async (key) =>{        
        let data=this.state.data;
        const id = data[key].id;
        const approveData = {approved:true};
        await axios.delete(`/api/v1/biztrip/${id}`, approveData);
        data.splice(key, 1);       
        this.setState(data);
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
                    <TableCell align='center'>이메일</TableCell>
                    <TableCell align='center'>프로젝트</TableCell>
                    <TableCell align='center'>출장지역</TableCell>
                    <TableCell align='center'>출장회사</TableCell>
                    <TableCell align='center'>출장목적</TableCell>
                    <TableCell align='center'>출장시작일</TableCell>
                    <TableCell align='center'>출장종료일</TableCell>
                    <TableCell align='center'>승인</TableCell>
                    <TableCell align='center'>취소</TableCell>
                </TableRow>
            </TableHead>
        <TableBody>

        {

        this.state.data.map( (EmployeeData, index) =>
            <TableRow>
                <TableCell align='center'>{EmployeeData.employeeId}</TableCell>                
                <TableCell align='center'>{EmployeeData.korName}</TableCell>
                <TableCell align='center'>{EmployeeData.staffLevelName}</TableCell>
                <TableCell align='center'>{EmployeeData.email}</TableCell>
                <TableCell align='center'>{EmployeeData.project.name}</TableCell>
                <TableCell align='center'>{EmployeeData.location}</TableCell>
                <TableCell align='center'>{EmployeeData.companyName}</TableCell>            
                <TableCell align='center'>{EmployeeData.bizPurpose.name}</TableCell>  
                <TableCell align='center'>{EmployeeData.startDate}</TableCell>
                <TableCell align='center'>{EmployeeData.endDate}</TableCell>

                <TableCell  key = {index} align='center'>
                    <Link onClick={()=>{this.handleApprove(index)}}>승인하기</Link>
                </TableCell>

                <TableCell  key = {index} align='center'>
                    <Link onClick={()=>{this.handleDelete(index)}}>취소하기</Link>
                </TableCell>                           
            </TableRow>
        )}
        </TableBody>
        </Table>
        </div>

    );

    }

}

export default ApproveBizTrip;
