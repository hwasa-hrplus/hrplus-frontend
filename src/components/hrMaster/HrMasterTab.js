import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
 
} from '@material-ui/core';
import { Button } from '@mui/material';
import PopupPostCode from '../admin/PopupPostCode';
import axios from 'axios';
import authService from '../../services/auth.service';
import authHeader from '../../services/auth-header';

class HrMasterTab extends Component {
    constructor(props) {
        const user = authService.getCurrentUser();
        super(props);
        console.log('in constructor');

        this.state = {
            modalOpen: false,
            isFile : false,    
            data: [],
            rootUrl:"/api/v1",
            value: 0,
            id: user?user.id:null
        }

        
    }
    componentDidMount() {
        this.getMyData(); 
    }

    getMyData = async () => {
        
        let data = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/'+this.state.id, { headers: authHeader() });
        console.log("dfsdf:",this.state.id);
        data = data.data;

        let project = await axios.get(this.state.rootUrl+'/biztrip/project/'+this.state.id,{ headers: authHeader() });
        const projectData = project.data;
        this.setState({project:projectData});

        //workType 구현
        const workType = data.map((updateData) => updateData.workType);
        if (workType[0] === true) {
            this.setState(data.map((updateData) => updateData.workType = "근무자"));
        } else {
            this.setState(data.map((updateData) => updateData.workType = "휴직자"));
        }

        this.updateBirthDate(data);
     //   this.searchAdmin(data);  
        this.updateDepartment(data);

        //우편번호
        this.setState({
            address: data.map((employeeData) => employeeData.address),
            addressCode: data.map((employeeData) => employeeData.addressCode),
            addressDetail: data.map((employeeData) => employeeData.addressDetail),

        })
        //state 저장
        this.setState({data});

        if(this.state.content!==undefined){
            this.postImage();
        }
        console.log(this.state);      
    };

    updateBirthDate = (data) => {
        const birthDate = data.map((updateData) => updateData.birthDate);
        const removeIndex = birthDate[0].substring(0, birthDate[0].indexOf('T'));
        this.setState({updateBirthDate: removeIndex});
        return this.state.birthDate;
    }

    // searchAdmin = async (data)=>{

    //     const admin = data.map((updateData) => updateData.bossId);
    //     let bossData = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/'+admin[0], { headers: authHeader() });
    //     bossData = bossData.data
    //     console.log(bossData);

    //     const adminName = bossData.map((updateData) => updateData.korName);
    //     this.setState({adminName:adminName})
    // }
 
    //원부서 구현
    updateDepartment = (data) => {
        const department = data.map((updateData) => updateData.departmentName);
        const splitDepartment = department[0].split(" ");
        this.setState({updateDepartment: splitDepartment[2]});
        return this.state.updateDepartment;
    }

    render() {

        return (
        <div>
            {
                this
                    .state
                    .data
                    .map((employeeData) => {
                            return <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align='right'>생년월일</TableCell>
                                            <TableCell key={this.state.updateBirthDate}>{this.state.updateBirthDate}</TableCell>
                                            <TableCell align='right'>이메일</TableCell>
                                            <TableCell key={employeeData.email}>{employeeData.email}</TableCell>
                                            <TableCell align='right'>휴대폰</TableCell>
                                            <TableCell key={employeeData.phone}>{employeeData.phone}</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell align='right'>주소</TableCell>

                                            <TableCell align='left' colSpan='5' key={employeeData.address}>
                                                <Button variant="contained" onClick={this.openModal}>우편번호 검색</Button>
                                                <PopupPostCode
                                                    open={this.state.modalOpen}
                                                    close={this.closeModal}
                                                    address={this.state.address}
                                                    addressCode={this.state.addressCode}
                                                    addressDetail={this.state.addressDetail}/>
                                                
                                                    <TextField
                                                        label={this
                                                            .state
                                                            .addressCode[0]}
                                                        variant="outlined"
                                                        size="small"/>
                                                    <span>
                                                        <br/>
                                                    </span>
                                                    <TextField
                                                        label={this
                                                            .state
                                                            .address[0]}
                                                        variant="outlined"
                                                        style={{width: '53%'}}
                                                        size="small"/>
                                                    <span>
                                                        <br/>
                                                    </span>
                                                    <TextField
                                                        label={this
                                                            .state
                                                            .addressDetail[0]}
                                                        variant="outlined"
                                                        style={{width: '53%'}}
                                                        size="small"/>
                                               
                                            </TableCell>

                                        </TableRow>
                                        <TableRow>
                                            <TableCell align='right'>결재권자</TableCell>
                                            <TableCell key={this.state.adminName}>{this.state.adminName}</TableCell>   
                                            <TableCell align='right'>근무형태</TableCell>
                                            <TableCell key={employeeData.workType}>{employeeData.workType}</TableCell>
                                            <TableCell align='right'>주재지</TableCell>
                                            <TableCell key={employeeData.workPlaceName}>{employeeData.workPlaceName}</TableCell>
                                        </TableRow>
                                        <TableRow >

                                            <TableCell align='right'>프로젝트</TableCell>
                                            <TableCell align='left' >{this.state.project.code}</TableCell>
                                            <TableCell align='right' colSpan='3'>원부서</TableCell>
                                            <TableCell key={this.state.updateDepartment}>{this.state.updateDepartment}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                        }
                    )
                    }
                    <Button style={{marginTop:"20px", float:"right"}} type="submit" variant="contained">수정</Button>
            </div>
        )
    }
}
export default HrMasterTab;