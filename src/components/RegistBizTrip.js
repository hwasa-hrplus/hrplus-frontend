import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableCell, Input, Button, NativeSelect, } from '@material-ui/core';
import axios from 'axios';
import ProjectList from './ProjectList';
import DatePicker from './DatePicker';
import PopupPostCode from './PopupPostCode';
import authHeader from '../services/auth-header';

class RegistBizTrip extends Component {

constructor(props) {
    super(props);
    console.log('in constructor');

    this.state = {
        data: [],
        modalOpen:false,
        p_data: [],
        startDate:0,
        endDate:0,
        text:'',
        address:[],
    };
    }

    
    regist =async()=>{        
        if(this.state.projectName==null){
            alert('프로젝트를 선택해주세요');
        }else if(this.state.text == ''){
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
                bossId: this.state.data.map((employeeData) => employeeData.bossId)[0],
                employeeId: this.state.data.map((employeeData) => employeeData.id)[0],
                bizPurposeName:this.state.p_data.map((PurposeData) => PurposeData.name)[0],
                projectName:this.state.projectName,
                companyName:this.state.text,
                location: this.state.address[0]
            
                }).then(res=>{alert('출장신청 완료');
                })
                window.location.reload();
        }
    }
    
    

    onChange = (e)=>{
        this.setState({text:e.target.value})
    }
    recvProjectData = (name)=>{
        console.log('project code:' + name);
        this.setState({projectName:name});
    
    }

    datePickerFunc = (sd, ed) =>{
        console.log('Rs startdate: '+ sd);
        console.log('Rs enddate: '+ ed);

        this.setState({startDate:sd});
        this.setState({endDate:ed})
    }

    getMyData = async () => {
        let data = await axios.get('/api/v1/hrmaster/hradmin/300112',  { headers: authHeader() });
        data = data.data;
        console.log('this employee data is ' + JSON.stringify(data));

        this.setState({data});

        let admin = await axios.get('/api/v1/hrmaster/hradmin/admin/boss',  { headers: authHeader() });
        const adminData = admin.data;
        console.log(adminData);
    };

    getMyPurposeData = async () => {
        console.log('in getmypurpose');
        
        let p_data = await axios.get('/api/v1/biztrip/bizpurpose/list',  { headers: authHeader() });
        p_data = p_data.data;
        console.log('this purpose data is ' + JSON.stringify(p_data));
        this.setState({p_data});
    };

    componentDidMount() {
    console.log('in componentDidMount');
    this.getMyPurposeData();

    this.getMyData();
    }

    componentDidUpdate() {
    console.log('in componentDidUpdate');
    }

    componentWillUnmount() {
    console.log('in componentWillUnmount');
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

        <div>
            <Table>
            {
                this.state.data.map((employeeData, i) => 
                <TableBody>
                <TableRow>
                    <TableCell align='center'>성명</TableCell>
                    <TableCell align='center'>{employeeData.korName}</TableCell>
                    <TableCell align='center'>사번</TableCell>
                    <TableCell align='center'>{employeeData.id}</TableCell>
                </TableRow>
                
                <TableRow>
                    <TableCell align='center'>직책</TableCell>
                    <TableCell align='center'>{employeeData.role}</TableCell>
                    <TableCell align='center'>결재권자</TableCell>
                    <TableCell align='center'>{employeeData.bossId}</TableCell>
                </TableRow>
            
        
    
                <TableRow>
                    <TableCell align='center'>부서</TableCell>
                    <TableCell align='center'>{employeeData.departmentName}</TableCell>
                    <TableCell align='center'>연락처</TableCell>
                    <TableCell align='center'>{employeeData.phone}</TableCell>
                </TableRow>
                </TableBody>
                )
            }
        <TableRow>
            <TableCell align='center' >프로젝트</TableCell>
            <TableCell align='center' colSpan = "2">
            <Input align='center' readOnly='true' value={this.state.projectName} fullWidth={true}></Input>
        
            </TableCell>
            <TableCell align='rigth' >
                <ProjectList
                    recvProjectData={this.recvProjectData}
                />
            </TableCell>
        </TableRow>
        <TableRow>
        <TableCell align='center'>출장목적</TableCell>
        <TableCell align='center'>
        <NativeSelect>
        {
                this.state.p_data.map((PurposeData, i) => 
                <option key="PurposeName" value="PurposeName"> {PurposeData.name}</option>
            )
        }
        </NativeSelect>
        </TableCell>
        <TableCell align='center'>출장기관</TableCell>
        <TableCell align='center'>
        <Input type = "text"   name="companyName" value={this.text} onChange={this.onChange} />
        </TableCell>

        </TableRow>
        <TableRow>
        <TableCell align='center'>출장지</TableCell>
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
        <TableCell align='center' >출장기간</TableCell>
        <TableCell align='center'  colSpan="3">
            <DatePicker datePickerFunc={this.datePickerFunc}/>
        </TableCell>
        </TableRow>

        <TableRow>
        <TableCell align='right' colSpan='4'>
        <Button onClick={this.regist} variant="contained">신청</Button>
        </TableCell>

        </TableRow>

        {/* </TableHead> */}

        </Table>
        </div>
        
        );

        }

}

export default RegistBizTrip;