// 
import React, {Component} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Input,
    Select,
    MenuItem,

} from '@material-ui/core';
import { Button } from '@mui/material';
import PopupPostCode from './PopupPostCode';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

class EmployeeDetail extends Component {

    constructor(props) {
        super(props);
        console.log('in constructor');
        const link = document.location.href;
        const parameter = link.split('/')
        const id = parameter[5] ;
        console.log(id);


        this.state = {
            staffLevel: [],
            department: [],
            workPlace: [],
            admin:[],
            jobCategory : [],
            staffLevelName: "",
            departmentName: "",
            workPlaceName: "",
            jobCategoryName: "",
            bossId:"",
            workType:false,
            startDate:"",
            birthDate:"",
            detailAddress:"",
            filesId:"",
            role:"",
            modalOpen: false,
            id: id,
            isFile : false,    
            data: [],
            updateStartDate:"",
            updateBirthDate:"",
            rootUrl:"/api/v1/hrmaster"
        }

        console.log(this.state);
        this.getTable();
    }

     // select할 테이블 가져오기
     getTable = async () =>{

        let staffLevel = await axios.get(this.state.rootUrl+'/hradmin/admin/stafflevel');
        const data = staffLevel.data;
        console.log(data);

        let department = await axios.get(this.state.rootUrl+'/hradmin/admin/department');
        const departmentData = department.data;
        console.log(departmentData);

        let workPlace = await axios.get(this.state.rootUrl+'/hradmin/admin/workPlace');
        const workplaceData = workPlace.data;
        console.log(workplaceData);

        let jobCategory = await axios.get(this.state.rootUrl+'/hradmin/admin/jobCategory');
        const jobCategoryData = jobCategory.data;
        console.log(jobCategoryData);

        let admin = await axios.get(this.state.rootUrl+'/hradmin/admin/boss');
        const adminData = admin.data;
        this.setState({staffLevel:data, department:departmentData, workPlace:workplaceData, jobCategory:jobCategoryData, admin:adminData})
    }


    getMyData = async () => {

        let data = await axios.get(this.state.rootUrl+'/hradmin/admin/list/'+this.state.id);
        data = data.data;

        //workType 구현
        const workType = data.map((updateData) => updateData.workType);
        if (workType[0] === true) {
            this.setState(data.map((updateData) => updateData.workType = "근무자"));
        } else {
            this.setState(data.map((updateData) => updateData.workType = "휴직자"));
        }

        this.updateBirthDate(data);
        this.updateStartDate(data)
        this.updateDepartment(data);
        this.searchAdmin(data);
        this.getImage()
    

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

    onChange = (e, type) =>{
        const value = e.target.value;

        if(type==='staffLevel'){
            this.setState({staffLevelName:value})
        }else if(type==='id'){
            console.log(value);
            this.setState({id:value})
        }else if(type==='department'){
            console.log(value);
            this.setState({departmentName:value})
        }else if(type==='workPlace'){
            console.log(value);
            this.setState({workPlaceName:value})
        }else if(type==='jobCategory'){
            console.log(value);
            this.setState({jobCategoryName:value})
        }else if (type==='workType'){
            console.log(value);
            if(value==='근무자'){
                this.setState({workType:true})
            }
        }else if(type==='detailAddress'){
            this.setState({detailAddress:value})
        }else if(type==='role'){
            this.setState({role:value})
        }else if(type==='bossId'){
            console.log(this.state.admin)
            const adminList = this.state.admin
            for(let i =0; i<adminList.length; i ++){
                adminList.map((adminData) => {
                    if(adminData.korName.includes(value)){
                        this.setState({bossId:adminData.id})
                    }
                    })
                }
               
            }
    }

    updateBirthDate = (data) => {
        const birthDate = data.map((updateData) => updateData.birthDate);
        const removeIndex = birthDate[0].substring(0, birthDate[0].indexOf('T'));
        this.setState({updateBirthDate: removeIndex});
        return this.state.birthDate;
    }

    updateStartDate = (data) => {
        const date = data.map((updateData) => updateData.startDate);
        const removeIndex = date[0].substring(0, date[0].indexOf('T'));
        this.setState({updateStartDate: removeIndex});
        return this.state.startDate;
    }

    dateChange = (value) =>{
        this.setState({updateStartDate:value})
    }

    birthChange = (value)=>{
        this.setState({updateBirthDate:value})
    }
    //원부서 구현
    updateDepartment = (data) => {
        const department = data.map((updateData) => updateData.departmentName);
        const splitDepartment = department[0].split(" ");
        this.setState({updateDepartment: splitDepartment[2]});
        return this.state.updateDepartment;
    }

    //주소 찾기 구현
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }

    //사진 업로드 구현
    postImage = async(e) =>{

        const formData = new FormData();
        const file = e.target.files[0];
        console.log(file);
        formData.append("img", file);
        
        await axios.post(this.state.rootUrl+'/hradmin/image', formData)
            .then(res =>{
                console.log(res);
            })
 
    }

    getImage = async () =>{

        await axios({
            method:'GET',
            url: this.state.rootUrl+'/hradmin/image/'+this.state.id,
            responseType:'blob',
        })
        .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] } ));
            this.setState({setUrl:url})
           
        })
        .catch(e => {
            console.log(`error === ${e}`)
        })
        
        console.log(this.state.setUrl);
        
        
    }

    //결재권자 가져오기
    searchAdmin = async (data)=>{

        const admin = data.map((updateData) => updateData.bossId);
        let bossData = await axios.get(this.state.rootUrl+'/hradmin/admin/list/'+admin[0]);
        bossData = bossData.data
        console.log(bossData);

        const adminName = bossData.map((updateData) => updateData.korName);
        this.setState({adminName:adminName})
    }
 
    componentDidMount() {
        this.getMyData();
    }

      //화면 데이터 전송
      onSubmit = async (e)=>{
        e.preventDefault();
        console.log(e.target)
        console.log("onSubmit event 발생");
        console.log(this.state);

        const sendData ={
                id:e.target.id.value, 
                korName:e.target.korName.value,
                engName:e.target.engName.value,
                gender:e.target.gender.value,
                age:e.target.age.value,
                residentNum:e.target.residentNum.value,
                email:e.target.email.value,
                role:this.state.role,
                staffLevelName: this.state.staffLevelName,
                departmentName: this.state.departmentName,
                workPlaceName: this.state.workPlaceName,
                jobCategoryName: this.state.jobCategoryName,
                workType:this.state.workType,
                birthDate:this.state.birthDate,
                startDate:this.state.updateStartDate,
                phone:e.target.phone.value,
                address:this.state.address[0],
                addressCode:this.state.addressCode[0],
                addressDetail:this.state.detailAddress,
                bossId:this.state.bossId,
                filesId:this.state.filesId
            } 
            console.log(sendData);
            axios.post(this.state.rootUrl+'/hradmin/admin', sendData)
            .then((res) => {alert('사원 정보 수정 완료');      
                window.location.reload();
                console.log(res)
            })
            .catch((error) => {
                console.log(error.response)
            })
    }


    render() {
        return (
            <div>
                <form id="addPlayerFrm" onSubmit={this.onSubmit}>
                {
                    this
                        .state
                        .data
                        .map((employeeData, i) => {
                            return <Table>
                                {/* <TableHead></TableHead> */}
                                <TableBody>
                                    <TableRow>
                                        <TableCell align='center'>사진</TableCell>
                                        <TableCell align='right'>사번</TableCell>
                                        <TableCell key={i}><TextField name='id' label={employeeData.id} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>성별</TableCell>
                                        <TableCell key={employeeData.gender}><TextField name='gender' label={employeeData.gender} variant="outlined" size="small"/></TableCell>
                                    </TableRow>

                                    <TableRow >     
                                        <TableCell align='center' rowSpan='4'><img src={this.state.setUrl} alt="" style={{height:"300px", width:"250px"}}></img></TableCell>                                     
                                        <TableCell align='right'>성명</TableCell>
                                        <TableCell key={employeeData.korName}><TextField name='korName' label={employeeData.korName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>입사일</TableCell>
                                        <TableCell key={this.state.startDate}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                inputFormat="yyyy-MM-dd"
                                                value={this.state.updateStartDate}
                                                onChange={this.dateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                                />
                                        </LocalizationProvider>
                                            {/* <TextField label={this.state.updateStartDate} variant="outlined" size="small"/> */}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>영문성명</TableCell>
                                        <TableCell key={employeeData.engName}><TextField name='engName' label={employeeData.engName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>직책</TableCell>
                                        <TableCell key={employeeData.role}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="직책"
                                            onChange={e => this.onChange(e,'role')}
                                            defaultValue = {employeeData.role}
                                        >
                                            <MenuItem value='팀장'>팀장</MenuItem>
                                            <MenuItem value='팀원'>팀원</MenuItem>                                              
                                        </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>직급</TableCell>
                                        <TableCell key={employeeData.staffLevelName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="직급"
                                            onChange={e => this.onChange(e,'staffLevel')}
                                            defaultValue = {employeeData.staffLevelName}
                                        >
                                            {this.state.staffLevel.map((staffLevelData, i) => {
                                                return(
                                                    <MenuItem value={staffLevelData.name}>{staffLevelData.name}</MenuItem>
                                            )})}
                                        </Select>

                                        </TableCell>
                                        <TableCell align='right'>직무</TableCell>
                                        <TableCell key={employeeData.jobCategoryName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="직무"
                                            onChange={e => this.onChange(e,'jobCategory')}
                                            defaultValue = {employeeData.jobCategoryName}
                                        >
                                            {this.state.jobCategory.map((jobCategoryData, i) => {
                                                return(
                                                    <MenuItem value={jobCategoryData.name}>{jobCategoryData.name}</MenuItem>
                                            )})}
                                        </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>주민번호</TableCell>
                                        <TableCell key={employeeData.residentNum}><TextField name ='residentNum' label={employeeData.residentNum} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>연령</TableCell>
                                        <TableCell key={employeeData.age}><TextField name = 'age' label={employeeData.age} variant="outlined" size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'>
                                            <Input type = "file" acept="img/*" onChange={this.postImage}/>
                                            {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}
                                            
                                        </TableCell>
                                        <TableCell align='right'>부서</TableCell>
                                        <TableCell colSpan='3' key={employeeData.departmentName}>
                                            <TextField
                                                style ={{width: '70%'}}
                                                label={employeeData.departmentName}
                                                variant="outlined"
                                                fullWidth ={true}
                                                size="small"/></TableCell>
                                    </TableRow>

                                </TableBody>

                            </Table>
                        })

                }
                {
                    this
                        .state
                        .data
                        .map((employeeData) => {
                            return <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align='right'>생년월일</TableCell>
                                        <TableCell key={this.state.updateBirthDate}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                inputFormat="yyyy-MM-dd"
                                                value={this.state.updateBirthDate}
                                                onChange={this.birthChange}
                                                renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </TableCell>
                                        <TableCell align='right'>이메일</TableCell>
                                        <TableCell key={employeeData.email}><TextField name = 'email' label={employeeData.email} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>휴대폰</TableCell>
                                        <TableCell key={employeeData.phone}><TextField name = 'phone' label={employeeData.phone} variant="outlined" size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align='right'>주소</TableCell>

                                        <TableCell align='left' colSpan='5' key={employeeData.address}>
                                            <Button variant="contained" onClick={this.openModal}>우편번호 검색</Button>
                                            <PopupPostCode
                                                open={this.state.modalOpen}
                                                close={this.closeModal}
                                                address={this.state.address}
                                                addressCode ={this.state.addressCode}
                                                addressDetail ={this.state.addressDetail}
                                                />
                                            <div>
                                                <TextField
                                                  label={this.state.addressCode[0]}
                                                  variant="outlined"                                                
                                                  size="small"/>
                                              <span> <br/> </span>
                                              <TextField
                                                  label={this.state.address[0]}
                                                  variant="outlined"
                                                  style ={{width: '53%'}}
                                                  size="small"/>
                                              <span> <br/> </span>    
                                              <TextField
                                                  label={this.state.addressDetail[0]}
                                                  variant="outlined"
                                                  style ={{width: '53%'}}
                                                  size="small"/>
                                            </div>
                                          
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right'>결재권자</TableCell>
                                        <TableCell key={this.state.adminName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="직급"
                                            onChange={e => this.onChange(e,'bossId')}
                                            defaultValue = {this.state.adminName}
                                        >
                                            {this.state.admin.map((adminData, i) => {
                                                return(
                                                    <MenuItem value={adminData.korName}>{adminData.korName}</MenuItem>
                                            )})}
                                        </Select>
                                        </TableCell>
                                        <TableCell align='right'>근무형태</TableCell>
                                        <TableCell key={employeeData.workType}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="근무형태"
                                            onChange={e => this.onChange(e,'workType')}
                                            defaultValue = {employeeData.workType}
                                        >
                                            <MenuItem value='휴직자'>휴직자</MenuItem>
                                            <MenuItem value='근무자'>근무자</MenuItem>                                              
                                        </Select>
                                        </TableCell>
                                        <TableCell align='right'>주재지</TableCell>
                                        <TableCell key={employeeData.workPlaceName}><TextField
                                            label={employeeData.workPlaceName}
                                            variant="outlined"
                                            size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow >

                                        <TableCell align='right'>프로젝트</TableCell>
                                        <TableCell align='left' colSpan='5'>
                                            <Button variant="contained">프로젝트 찾기</Button>
                                            <span><br/></span>
                                            <TextField
                                                label=""
                                                style ={{width: '53%'}}
                                                size="small"
                                                variant="outlined"/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right'>Cost Center</TableCell>
                                        <TableCell ><TextField
                                            label=""
                                            variant="outlined"
                                            size="small"/></TableCell>
                                        <TableCell align='right' colSpan='3'>원부서</TableCell>
                                        <TableCell key={this.state.updateDepartment}>
                                            <TextField
                                            label={this.state.updateDepartment}
                                            variant="outlined"
                                            size="small"
                                           /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell key="button" colSpan='6' align='right'>
                                            <Button type= "submit" variant="contained">수정</Button>
                                            <span> </span>
                                            <Button variant="contained">삭제</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        })
                }
                </form>
            </div>
        );
    }

}

export default EmployeeDetail;