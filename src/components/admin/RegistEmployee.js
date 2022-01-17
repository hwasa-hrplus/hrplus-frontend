import { Input, Table, TableBody, TableCell, TableRow, TextField, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PopupPostCode from './PopupPostCode';
import { Button } from '@mui/material';
import ProjectList from '../bizTrip/ProjectList';
import authHeader from '../../services/auth-header';
import authService from '../../services/auth.service';

class RegistEmployee extends Component{

    constructor(props) {
        super(props);
        console.log('in constructor');

        this.state = {
            modalOpen: false,
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
            registAddress:[],
            registAddressCode:[],
            detailAddress:"",
            filesId:"",
            role:"",
            rootUrl:"/api/v1/"
        }

        this.getTable();
    }
    required = value => {
        if (!value) {
          return (
            <div className="alert alert-danger" role="alert">
              This field is required!
            </div>
          );
        }
      };

    // select할 테이블 가져오기
    getTable = async () =>{

        let staffLevel = await axios.get(this.state.rootUrl+'hrmaster/hradmin/stafflevel', { headers: authHeader() });
        const data = staffLevel.data;
        console.log(data);

        let department = await axios.get(this.state.rootUrl+'hrmaster/hradmin/department', { headers: authHeader() });
        const departmentData = department.data;
        console.log(departmentData);

        let workPlace = await axios.get(this.state.rootUrl+'hrmaster/hradmin/workPlace', { headers: authHeader() });
        const workplaceData = workPlace.data;
        console.log(workplaceData);

        let jobCategory = await axios.get(this.state.rootUrl+'hrmaster/hradmin/jobCategory', { headers: authHeader() });
        const jobCategoryData = jobCategory.data;
        console.log(jobCategoryData);

        let admin = await axios.get(this.state.rootUrl+'hrmaster/hradmin/boss', { headers: authHeader() });
        const adminData = admin.data;
        console.log(adminData);

        this.setState({staffLevel:data, department:departmentData, workPlace:workplaceData, jobCategory:jobCategoryData, admin:adminData})
    }

    dateChange = (value) =>{
        this.setState({startDate:value})
    }

    birthChange = (value)=>{
        this.setState({birthDate:value})
    }

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

    recvProjectData = (name)=>{
        console.log('project code:' + name[0]);
        this.setState({projectName:name[0],costCenter:name[1]});
      
    
    }

    //사진 업로드 구현
    postImage = async(e) =>{
            const formData = new FormData();
            const file = e.target.files[0];
            const id = this.state.id
            console.log(id);
            formData.append("img", file);
            
            await axios.post(this.state.rootUrl+'hrmaster/hradmin/image/'+id, formData, { headers: authHeader() })
                .then(res =>{
                    console.log(res);
                })

                    
            let image = await axios.get(this.state.rootUrl+'hrmaster/hradmin/regist/image/'+id, { headers: authHeader() });
            const imageData = image.data;
            console.log(imageData);   
            this.setState({filesId:imageData.uuid}) 
     
           
            this.getImage(id)
        }

        getImage = async (id) =>{
      
            await axios({
                method:'GET',
                url:this.state.rootUrl+'hrmaster/hradmin/image/'+id,
                responseType:'blob',
                headers: authHeader() 
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
    //주소 찾기 구현
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }

    //화면 데이터 전송
    onSubmit = async (e)=>{
        e.preventDefault();
        console.log("onSubmit event 발생");
        console.log(this.state);
        authService.register(
            e.target.email.value,
            e.target.password.value,
            this.state.role==='팀장'? ['admin']:['user'],
            e.target.id.value, 
            e.target.korName.value                 
        );
        const sendData ={
                id:e.target.id.value, 
                korName:e.target.korName.value,
                engName:e.target.engName.value,
                gender:e.target.gender.value,
                age:e.target.age.value,
                residentNum:e.target.residentNum.value,
                email:e.target.email.value,
                password:e.target.password.value,
                role:this.state.role,
                staffLevelName: this.state.staffLevelName,
                departmentName: this.state.departmentName,
                workPlaceName: this.state.workPlaceName,
                jobCategoryName: this.state.jobCategoryName,
                workType:this.state.workType,
                birthDate:this.state.birthDate,
                startDate:this.state.startDate,
                phone:e.target.phone.value,
                address:this.state.registAddress[0],
                addressCode:this.state.registAddressCode[0],
                addressDetail:this.state.detailAddress,
                bossId:this.state.bossId,
                filesId:this.state.filesId
            } 
            console.log(sendData);
            axios.post(this.state.rootUrl+'hrmaster/hradmin/', sendData, { headers: authHeader() })
            .then((res) => {alert('사원 정보 추가 완료');      
                 window.location.href='/admin/list';
                console.log(res)
            })
            .catch((error) => {
                console.log(error.response)
            })

        const sendBizTripData = {
            code:this.state.projectName,
            id:this.state.id
        }



        axios.post(this.state.rootUrl+'biztrip/project/insert', sendBizTripData, { headers: authHeader() })

        .then((res) => {    
            console.log(res)
        })
        .catch((error) => {
            console.log(error.response)
        })
    }



    render() {
    console.log(this.state.address)
    return (
        <div>
            <form id="addPlayerFrm" onSubmit={this.onSubmit}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align='center'>사진</TableCell>
                        <TableCell align='right'>사번</TableCell>
                        <TableCell key='id'><TextField onChange={e => this.onChange(e,'id')} name='id' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>성별</TableCell>
                        <TableCell key='gender'><TextField name='gender' variant="outlined" size="small"/></TableCell>

                    </TableRow>

                    <TableRow >

                        <TableCell align='center' rowSpan='4'>
                            <img
                                src={this.state.setUrl}
                                alt=""
                                style={{
                                    height: "300px",
                                    width: "250px"
                                }}></img>
                        </TableCell>
                        <TableCell align='right'>성명</TableCell>
                        <TableCell key='korName'><TextField name='korName' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>입사일</TableCell>
                        <TableCell key='startDate'> 
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            inputFormat="yyyy-MM-dd"
                            value={this.state.startDate}
                            onChange={this.dateChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        </TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell align='right'>영문성명</TableCell>
                        <TableCell key='engName'><TextField name='engName' variant="outlined" size="small" validations={[this.required]}/></TableCell>
                        <TableCell align='right'>직책</TableCell>
                        <TableCell key='role'>
                            <Select 
                                value={this.state.selectValue}
                                label="직책"
                                onChange={e => this.onChange(e,'role')}
                                defaultValue = ""
                            >
                                <MenuItem value='팀장'>팀장</MenuItem>
                                <MenuItem value='팀원'>팀원</MenuItem>                                              
                            </Select>
                        </TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell align='right'>직급</TableCell>
                        <TableCell key='stafflevel'>
                            <Select 
                                value={this.state.selectValue}
                                label="직급"
                                onChange={e => this.onChange(e,'staffLevel')}
                                defaultValue = ""
                            >
                                {this.state.staffLevel.map((staffLevelData, i) => {
                                    return(
                                        <MenuItem value={staffLevelData.name}>{staffLevelData.name}</MenuItem>
                                )})}
                            </Select>
                            </TableCell>
                        <TableCell align='right'>직무</TableCell>
                        <TableCell key={this.state.selectValue}> 
                        <Select 
                                value={this.state.selectValue}
                                label="직무"
                                onChange={e => this.onChange(e,'jobCategory')}
                                defaultValue = ""
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
                        <TableCell key='residentNum'><TextField name='residentNum' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>연령</TableCell>
                        <TableCell key='age'><TextField name='age' variant="outlined" size="small"/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center'>
                            <Input type="file" onChange={this.postImage}/> {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}
                        </TableCell>
                        <TableCell align='right'>부서</TableCell>
                        <TableCell colSpan='3' key={this.state.selectValue}>
                            <Select 
                                value={this.state.selectValue}
                                label="부서"
                                onChange={e => this.onChange(e,'department')}
                                defaultValue = ""
                            >
                        {this.state.department.map((departmentData, i) => {
                            return(
                                <MenuItem value={departmentData.name}>{departmentData.name}</MenuItem>
                        )})}
                            </Select>
                        </TableCell>
                    </TableRow>

                </TableBody>

             </Table>
             <Table>
                 <TableBody>
                     <TableRow>
                         <TableCell align='right'>생년월일</TableCell>
                         <TableCell key='birthDate'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                inputFormat="yyyy-MM-dd"
                                value={this.state.birthDate}
                                onChange={this.birthChange}
                                renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                         </TableCell>
                         <TableCell align='right'>이메일</TableCell>
                         <TableCell key='email'><TextField name='email' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>휴대폰</TableCell>
                         <TableCell key='phone'><TextField name='phone' variant="outlined" size="small"/></TableCell>
                     </TableRow>
                     <TableRow >
                         <TableCell align='right'>주소</TableCell>

                         <TableCell align='left' colSpan='5' key='post'>
                             <Button variant="contained" onClick={this.openModal}>우편번호 검색</Button>
                             <PopupPostCode
                                 open={this.state.modalOpen}
                                 close={this.closeModal}
                                 registAddress={this.state.registAddress}
                                 registAddressCode ={this.state.registAddressCode}
                                
                                 />
                                  {console.log(this.state)}
                             <TextField
                                 label={this.state.registAddressCode[0]}
                                 variant="outlined"
                                 size="small"/>
                             <span>
                                 <br/>
                             </span>
                             <TextField
                                 label={this.state.registAddress[0]}

                                 variant="outlined"
                                 style ={{width: '53%'}}
                                 size="small"/>
                             <span>
                                 <br/>
                             </span>
                             <TextField
                                 onChange={e => this.onChange(e,'detailAddress')}
                                 variant="outlined"
                                 style ={{width: '53%'}}
                                 size="small"/>
                         </TableCell>

                     </TableRow>
                     <TableRow>
                         <TableCell align='right'>결재권자</TableCell>
                         <TableCell key='bossId'>
                            <Select 
                                    value={this.state.selectValue}
                                    label="직급"
                                    onChange={e => this.onChange(e,'bossId')}
                                    defaultValue = ""
                                >
                            {this.state.admin.map((adminData, i) => {
                                return(
                                    <MenuItem value={adminData.korName}>{adminData.korName}</MenuItem>
                            )})}
                            </Select>
                         </TableCell>
                         <TableCell align='right'>근무형태</TableCell>
                         <TableCell key='workType'>
                             <Select 
                                value={this.state.selectValue}
                                label="근무형태"
                                onChange={e => this.onChange(e,'workType')}
                                defaultValue = ""
                            >
                                <MenuItem value='휴직자'>휴직자</MenuItem>
                                <MenuItem value='근무자'>근무자</MenuItem>                                              
                            </Select>
                         </TableCell>
                         <TableCell align='right'>주재지</TableCell>
                         <TableCell key={this.state.selectValue}>
                            <Select 
                                value={this.state.selectValue}
                                label="주재지"
                                onChange={e => this.onChange(e,'workPlace')}
                                defaultValue = ""
                            >
                                {this.state.workPlace.map((workplaceData, i) => {
                                    return(
                                        <MenuItem value={workplaceData.name}>{workplaceData.name}</MenuItem>
                                )})}
                            </Select>
                         </TableCell>
                     </TableRow>
                     <TableRow >

                         <TableCell align='right'>프로젝트</TableCell>
                         <TableCell align='center' colSpan = "4">
                            <Input align='center' readOnly='true' value={this.state.projectName} fullWidth={true}></Input>
                        
                            </TableCell>
                            <TableCell align='rigth' >
                                <ProjectList
                                    recvProjectData={this.recvProjectData}
                                />
                            </TableCell>
                     </TableRow>
                     <TableRow>
                        <TableCell key="password"  align='right'>초기 비밀번호
                             </TableCell>
                        <TableCell  colSpan='5' align = 'left'>
                            <TextField name='password'   variant="outlined" size="small"/>
                        </TableCell>
                        
                     </TableRow>
                     <TableRow>
                        <TableCell key="button" align='right' colSpan='6'>
                             <Button type='submit' variant="contained">등록</Button>                      
                         </TableCell>
                     </TableRow>
                 </TableBody>
            
            </Table> 
            </form>
        </div>
    );
    }
};

export default RegistEmployee;