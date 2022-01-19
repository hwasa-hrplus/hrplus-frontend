import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableCell, Input, NativeSelect, } from '@material-ui/core';
import axios from 'axios';
import ProjectList from './ProjectList';
import PopupPostCode from './PopupPostCode';
import authService from '../../services/auth.service';
import ReactDatePicker from 'react-datepicker';
import authHeader from '../../services/auth-header';
import { Button } from '@mui/material';

class RegistBizTrip extends Component {

constructor(props) {
    super(props);
    console.log('in constructor');

    this.state = {
        data: [],
        modalOpen:false,
        p_data: [],
        startDate:new Date(),
        endDate:new Date(),
        text:'',
        id:authService.getCurrentUser().id,
        address:[],
        adminData:[],
        bizPurposeName:"프로젝트 수행"
    };
    }

    
    regist =async()=>{        
        if(this.state.projectName==null){
            alert('프로젝트를 선택해주세요');
        }else if(this.state.costCenter == ''){
            alert('출장기관을 입력해주세요.')
        }else if(this.state.address[0] == null){
            alert('출장지를 입력해주세요.')
        }else if(this.state.startDate == 0 || this.state.endDate == 0){
            alert('날짜를 선택해주세요.')
        }
        else{
            await axios.post('/api/v1/biztrip'
            ,{
                startDate:this.state.startDate,
                endDate:this.state.endDate,
                bossId: this.state.bid,
                employeeId: this.state.id,
                bizPurposeName:this.state.bizPurposeName,
                projectName:this.state.projectName,
                companyName:this.state.costCenter,
                location: this.state.address[0]
            
                }).then(res=>{alert('출장신청 완료');
                })
                window.location.href='/biztrip/bizTripDetail';

                await axios.post('/api/v1/mail/send'
                ,{
                    address:this.state.email,
                    name:this.state.korName,
                    projectName:this.state.projectName
                })
                .then((res)=>console.log('결재권자에게 메일발송 완료'))
        }
    }


   
    recvProjectData = (name)=>{
        console.log('project code:' + name);
        this.setState({projectName:name[0],costCenter:name[1]});    
    }

    getMyData = async () => {
        console.log('getmyData!!!!!!');

        const user = authService.getCurrentUser();  

        let data = await axios.get('/api/v1/hrmaster/hrfixed/'+user.id, { headers: authHeader() });
        data = data.data;
        console.log('this employee 고정data is ' + JSON.stringify(data));

        this.setState({korName:data.korName})
        this.setState({departmentName:data.departmentName})
        this.setState({role:data.role})

        
        let data2 = await axios.get('/api/v1/hrmaster/hrbasic/'+user.id, { headers: authHeader() });
        data2 = data2.data;
        console.log('this employee basic data is ' + JSON.stringify(data2));
        this.setState({phone: data2.phone});

        let data3 = await axios.get('/api/v1/biztrip/employeeboss/'+user.id, { headers: authHeader() });
        data3 = data3.data;
        console.log('this employee bossid data is ' + JSON.stringify(data3));
        this.setState({bid:data3.bid});

        console.log(this.state.bid+"bid!!!!!!!!!!!!");
        
        
        let admin = await axios.get('/api/v1/hrmaster/hrfixed/'+data3.bid,{ headers: authHeader() } );
        const adminData = admin.data;
        console.log( adminData);
        this.setState({boss_korName:adminData.korName});
        


        let admin2 = await axios.get('/api/v1/hrmaster/hrbasic/'+data3.bid,{ headers: authHeader() } );
        const adminData2 = admin2.data;
        this.setState({email:adminData2.email})
        console.log(this.state.email+"boss-email");
    };


    getMyPurposeData = async () => {
        console.log('in getmypurpose');
        
        let p_data = await axios.get('/api/v1/biztrip/bizpurpose/list');
        p_data = p_data.data;
        console.log('this purpose data is ' + JSON.stringify(p_data));
        this.setState({p_data});
    };


    componentDidMount = ()=> {
    console.log('in componentDidMount');
    this.getMyPurposeData();
    this.getMyData();
    }

    componentDidUpdate = () =>{
    console.log('in componentDidUpdate');
    }

    componentWillUnmount = ()=> {
    console.log('in componentWillUnmount');
    }

    onChange=(e)=>{
        console.log(e);
        const name = e.target.value;
        console.log(name+"!");
        this.setState({bizPurposeName:name})
        console.log('purposename:'+this.state.bizPurposeName);
        
        
    }


    //주소 찾기 구현
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }
    render() {

    return (

        <div className="ContentWrapper">
            <Table>
       
                <TableBody>
                <TableRow>
                    <TableCell align='right' style={{fontWeight:'bold'}}>성명</TableCell>
                    <TableCell align='left'>{this.state.korName}</TableCell>
                    <TableCell align='right' style={{fontWeight:'bold'}}>사번</TableCell>
                    <TableCell align='left'>{this.state.id}</TableCell>
                </TableRow>
                
                <TableRow>
                    <TableCell align='right' style={{fontWeight:'bold'}}>직책</TableCell>
                    <TableCell align='left'>{this.state.role}</TableCell>
                    <TableCell align='right' style={{fontWeight:'bold'}}>결재권자</TableCell>
                    <TableCell align='left'>{this.state.boss_korName}</TableCell>
                   
                </TableRow>
            
        
    
                <TableRow>
                    <TableCell align='right' style={{fontWeight:'bold'}}>부서</TableCell>
                    <TableCell align='left'>{this.state.departmentName}</TableCell>
                    <TableCell align='right' style={{fontWeight:'bold'}}>연락처</TableCell>
                    <TableCell align='left'>{this.state.phone}</TableCell>
                </TableRow>
                </TableBody>
          
        <TableRow>
            <TableCell align='right' style={{fontWeight:'bold'}}>프로젝트</TableCell>
            <TableCell align='center' colSpan = "2">
            <Input align='center' readOnly='true' value={this.state.projectName} fullWidth={true}></Input>
        
            </TableCell>
            <TableCell >
                <ProjectList
                    recvProjectData={this.recvProjectData}
                />
            </TableCell>
        </TableRow>
        <TableRow>
        <TableCell align='right' style={{fontWeight:'bold'}}>출장목적</TableCell>
        <TableCell align='center'>
        <NativeSelect
            onChange = {e =>this.onChange(e)} 
            value={this.state.purposeName}
            >
             {
                this.state.p_data.map((PurposeData, i) => 
                <option key="PurposeName" > {PurposeData.name}</option>
            )
        }
        </NativeSelect>
        </TableCell>
        <TableCell align='right' style={{fontWeight:'bold'}}>출장기관</TableCell>
        <TableCell align='left'>
        <Input type = "text"   name="companyName" value={this.state.costCenter} />
        </TableCell>

        </TableRow>
        <TableRow>
        <TableCell align='right' style={{fontWeight:'bold'}}>출장지</TableCell>
        <TableCell align='center' colSpan='2' >
            
            <PopupPostCode
                open={this.state.modalOpen}
                close={this.closeModal}
                address={this.state.address}
               
            />
            <Input align='center' readOnly='true' value={this.state.address[0]} fullWidth={true}></Input>
        
        </TableCell>
        <TableCell>
            <Button variant="contained" onClick={this.openModal}>주소 검색</Button>
        </TableCell>




        </TableRow>

        <TableRow>
        <TableCell align='right' style={{fontWeight:'bold'}}>출장기간</TableCell>
        <TableCell align='center'  colSpan="3">
            <table >
            <tr >
                <td>
                <div >
                         <ReactDatePicker
                        dateFormat="yyyy년 MM월 dd일"
                        selected={this.state.startDate}
                        onChange={(date) => this.setState({startDate:date})}
                        selectsStart
                        minDate={new Date()}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        showYearDropdown
                        />
                </div>
                </td>
                <td> ~ </td>
                <td>
                <div>
                             <ReactDatePicker
                            dateFormat="yyyy년 MM월 dd일"
                            selected={this.state.endDate}
                            onChange={(date) => this.setState({endDate:date})}
                            selectsEnd
                            minDate={this.state.startDate}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            showYearDropdown
                            />
                </div>
                </td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>
                    
                       <h6> {Math.ceil((this.state.endDate.getTime() - this.state.startDate.getTime()) / (1000*60*60*24))}박 &nbsp;
                        {Math.ceil((this.state.endDate.getTime() - this.state.startDate.getTime()) / (1000*60*60*24)) + 1}일</h6>
                </td>
               
             </tr>
        </table>    

        </TableCell>
        </TableRow>

        </Table>
        <Button
                        style={{
                            marginTop: "20px",
                            float: "right"
                        }}
                        onClick={this.regist}
                        variant="contained">신청</Button>

        </div>
        
        );

        }

}

export default RegistBizTrip;