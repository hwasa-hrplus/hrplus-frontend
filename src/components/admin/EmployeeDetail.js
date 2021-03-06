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
import ProjectList from '../bizTrip/ProjectList';
import authHeader from '../../services/auth-header';
import './Modal.css';

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
            bossId:"",
            startDate:"",
            birthDate:"",
            filesId:"",
            modalOpen: false,
            id: id,
            isFile : false,    
            data: [],
       
            updateStartDate:"",
            updateBirthDate:"",
            workType:false,
            rootUrl:"/api/v1"
        }
    }

    getMyData = async () => {

        let data = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/'+this.state.id, { headers: authHeader() });
        data = data.data;

        let staffLevel = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/stafflevel', { headers: authHeader() });
        const staffLevelData = staffLevel.data;

        let department = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/department', { headers: authHeader() });
        const departmentData = department.data;

        let workPlace = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/workPlace', { headers: authHeader() });
        const workplaceData = workPlace.data;

        let jobCategory = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/jobCategory', { headers: authHeader() });
        const jobCategoryData = jobCategory.data;

        let admin = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/boss', { headers: authHeader() });
        const adminData = admin.data;
        let project="";
        await axios.get(this.state.rootUrl+'/biztrip/project/'+this.state.id, { headers: authHeader() })
        .then((res)=>{
            project=res.data.code;
        })
        .catch((error) => {
            console.log(error.response)            
        })
        

        this.setState({staffLevel:staffLevelData, department:departmentData, workPlace:workplaceData, jobCategory:jobCategoryData, admin:adminData, projectName:project})


        this.updateBirthDate(data);
        this.updateStartDate(data)
        this.updateDepartment(data);
        this.searchAdmin(data);
        this.getImage()

        if(data[0].workType===true){
            this.setState({workName:'?????????'})
        }else{
            this.setState({workName:'?????????'})
        };
 
        this.setState({
            address: data.map((employeeData) => employeeData.address),
            addressCode: data.map((employeeData) => employeeData.addressCode),
            addressDetail: data[0].addressDetail,
            role: data[0].role,
            age: data[0].age,
            residentNum: data[0].residentNum,
            email: data[0].email,
            gender: data[0].gender,
            password: data[0].password,
            korName: data[0].korName,
            engName:data[0].engName,
            staffLevelName:data[0].staffLevelName,
            departmentName:data[0].departmentName,
            jobCategoryName:data[0].jobCategoryName,
            workPlaceName:data[0].workPlaceName,
            phone: data[0].phone,
            bossId: data[0].bossId,
            workType:data[0].workType,

        })
        //state ??????
        this.setState({data});

        if(this.state.content!==undefined){
            this.postImage();
        }   
    };

    onChange = (e, type) =>{
        const value = e.target.value;

        if(type==='staffLevel'){
            this.setState({staffLevelName:value})
        }else if(type==='id'){
            this.setState({id:value})
        }else if(type==='korName'){
            this.setState({korName:value})
        }else if(type==='engName'){
            this.setState({engName:value})
        }else if(type==='password'){
            this.setState({password:value})
        }else if(type==='phone'){
            this.setState({phone:value})
        }else if(type==='email'){
            this.setState({email:value})
        }else if(type==='department'){
            this.setState({departmentName:value})
        }else if(type==='workPlace'){
            console.log(value)
            this.setState({workPlaceName:value})
        }else if(type==='jobCategory'){
            this.setState({jobCategoryName:value})
        }else if(type==='age'){
            this.setState({age:value})
        }else if(type==='residentNum'){
            this.setState({residentNum:value})
        }else if(type==='gender'){
            this.setState({gender:value})
        }else if (type==='workType'){
            if(value==='?????????'){
                    this.setState({workType:true});
            } else {
                    this.setState({workType:false});
                }
        }else if(type==='addressDetail'){
            this.setState({addressDetail:value})
        }else if(type==='project'){
            this.setState({projectName:value})
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
        this.setState({projectName:name[0],costCenter:name[1]});
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
    //????????? ??????
    updateDepartment = (data) => {
        const department = data.map((updateData) => updateData.departmentName);
        const splitDepartment = department[0].split(" ");
        this.setState({updateDepartment: splitDepartment[2]});
        return this.state.updateDepartment;
    }

    //?????? ?????? ??????
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }

    //?????? ????????? ??????
    postImage = async(e) =>{

        const formData = new FormData();
        const file = e.target.files[0];
        console.log(file);
        formData.append("img", file);
        const id = this.state.id;

        await axios.put(this.state.rootUrl+'/hrmaster/hradmin/image/'+id, formData, { headers: authHeader() })
            .then(res =>{
                console.log(res);
            })
 
            let image = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/regist/image/'+id, { headers: authHeader() });
            const imageData = image.data;
            console.log(imageData);   
            this.setState({filesId:imageData.uuid}) 
     
            this.getImage()
    }

    getImage = async () =>{

        await axios({
            method:'GET',
            url: this.state.rootUrl+'/hrmaster/hradmin/image/'+this.state.id,
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

    //???????????? ????????????
    searchAdmin = async (data)=>{

        const admin = data.map((updateData) => updateData.bossId);
        let bossData = await axios.get(this.state.rootUrl+'/hrmaster/hradmin/'+admin[0] ,{ headers: authHeader() });
        bossData = bossData.data
        console.log(bossData);

        const adminName = bossData.map((updateData) => updateData.korName);
        this.setState({adminName:adminName})
    }
 
    componentDidMount() {
        this.getMyData();
    }

      //?????? ????????? ??????
      onSubmit = async (e)=>{
        e.preventDefault();
        console.log("onSubmit event ??????");
        console.log(this.state);

        const sendData ={
                id:this.state.id, 
                korName:this.state.korName,
                engName:this.state.engName,
                gender:this.state.gender,
                age:this.state.age,
                residentNum:this.state.residentNum,
                email:this.state.email,
                role:this.state.role,
                password:this.state.password,
                staffLevelName: this.state.staffLevelName,
                departmentName: this.state.departmentName,
                workPlaceName: this.state.workPlaceName,
                jobCategoryName: this.state.jobCategoryName,
                workType:this.state.workType,
                birthDate:this.state.updateBirthDate,
                startDate:this.state.updateStartDate,
                phone:this.state.phone,
                address:this.state.address[0],
                addressCode:this.state.addressCode[0],
                addressDetail:this.state.addressDetail,
                bossId:this.state.bossId,
                filesId:this.state.filesId
            } 
            console.log(sendData);
            axios.put(this.state.rootUrl+'/hrmaster/hradmin/'+this.state.id, sendData, { headers: authHeader() })
            .then((res) => {alert('?????? ?????? ?????? ??????');      
                window.location.reload();
                console.log(res)
            })
            .catch((error) => {
                alert('?????? ?????? ????????? ?????????');  
                console.log(error.response)
            })

            const sendBizTripData = {
                code:this.state.projectName,
                id:this.state.id
            }
    
            axios.put(this.state.rootUrl+'/biztrip/project/'+this.state.id, sendBizTripData, { headers: authHeader() })
            .then((res) => {    
                console.log(res)
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    deleteEmployee = () =>{

        const answer = window.confirm('??????('+this.state.id+')??? ?????????????????????????')
        if(answer){
            axios.delete(this.state.rootUrl+'/hrmaster/'+this.state.id, { headers: authHeader() })
            .then((res) => {alert('?????? ?????? ??????')
            window.location.href='/admin/list';

            })
            axios.delete(this.state.rootUrl+'/biztrip/project/'+this.state.id, { headers: authHeader() })
            .then((res) => 
                console.log(res)
            )
        }
    }


    render() {
        return (
            <div className="ContentWrapper">
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
                                        <TableCell align='center' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={i}><TextField name='id' label={employeeData.id} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.gender}>
                                            <TextField 
                                                onChange={e => this.onChange(e,'gender')}
                                                name='gender' 
                                                label={employeeData.gender}
                                                variant="outlined"
                                                size="small"/>
                                            </TableCell>
                                    </TableRow>

                                    <TableRow >     
                                        <TableCell align='center' rowSpan='4'><img src={this.state.setUrl} alt="" style={{height:"300px", width:"250px"}}></img></TableCell>                                     
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.korName}>
                                            <TextField 
                                                name='korName' 
                                                onChange={e => this.onChange(e,'korName')}
                                                label={employeeData.korName} 
                                                variant="outlined" 
                                                size="small"/>
                                            </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>?????????</TableCell>
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

                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell key={employeeData.engName}>
                                            <TextField 
                                                name='engName' 
                                                onChange={e => this.onChange(e,'engName')}
                                                label={employeeData.engName} 
                                                variant="outlined" 
                                                size="small"/>
                                            </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.role}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="??????"
                                            onChange={e => this.onChange(e,'role')}
                                            defaultValue = {employeeData.role}
                                        >
                                            <MenuItem value='??????'>??????</MenuItem>
                                            <MenuItem value='??????'>??????</MenuItem>                                              
                                        </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.staffLevelName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="??????"
                                            onChange={e => this.onChange(e,'staffLevel')}
                                            defaultValue = {employeeData.staffLevelName}
                                        >
                                            {this.state.staffLevel.map((staffLevelData, i) => {
                                                return(
                                                    <MenuItem value={staffLevelData.name}>{staffLevelData.name}</MenuItem>
                                            )})}
                                        </Select>

                                        </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.jobCategoryName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="??????"
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

                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell key={employeeData.residentNum}>
                                            <TextField 
                                                onChange={e => this.onChange(e,'residentNum')}
                                                name ='residentNum' 
                                                label={employeeData.residentNum}
                                                variant="outlined" 
                                                size="small"/>
                                            </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell key={employeeData.age}>
                                            <TextField 
                                                name = 'age' 
                                                onChange={e => this.onChange(e,'age')}
                                                label={employeeData.age}
                                                variant="outlined" 
                                                size="small"/>
                                            </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'>
                                            <Input type = "file" acept="img/*" onChange={this.postImage}/>
                                            {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}
                                            
                                        </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>??????</TableCell>
                                        <TableCell colSpan='3' key={employeeData.departmentName}>
                                            <Select 
                                                value={this.state.selectValue}
                                                label="??????"
                                                onChange={e => this.onChange(e,'department')}
                                                defaultValue = {employeeData.departmentName}
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
                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
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
                                        <TableCell align='right' style={{fontWeight:'bold'}}>?????????</TableCell>
                                        <TableCell key={employeeData.email}>
                                            <TextField 
                                                name = 'email' 
                                                onChange={e => this.onChange(e,'email')}
                                                label={employeeData.email} 
                                                variant="outlined" 
                                                size="small"/></TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}} >?????????</TableCell>
                                        <TableCell key={employeeData.phone}>
                                            <TextField 
                                                name = 'phone' 
                                                onChange={e => this.onChange(e,'phone')}
                                                label={employeeData.phone} 
                                                variant="outlined" 
                                                size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align='right'style={{fontWeight:'bold'}}>??????</TableCell>

                                        <TableCell align='left' colSpan='5' key={employeeData.address}>
                                            <Button variant="contained" onClick={this.openModal}>???????????? ??????</Button>
                                            <PopupPostCode
                                                open={this.state.modalOpen}
                                                close={this.closeModal}
                                                address={this.state.address}
                                                addressCode ={this.state.addressCode}
                                                addressDetail ={this.state.addressDetail}
                                                />
                                          
                                                <TextField
                                                  label={this.state.addressCode[0]}
                                                  variant="outlined" 
                                                  style ={{marginLeft:'10px'}}                                               
                                                  size="small"/>
                                              <span> <br/> </span>
                                              <TextField
                                                  label={this.state.address[0]}
                                                  variant="outlined"
                                                  style ={{width: '53%', marginTop:'10px' }}
                                                  size="small"/>
                                              <span> <br/> </span>    
                                              <TextField
                                                  label={this.state.addressDetail}
                                                  onChange={e => this.onChange(e,'addressDetail')}
                                                  variant="outlined"
                                                  style ={{width: '53%', marginTop:'10px'}}
                                                  size="small"/>
                                          
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell key={this.state.adminName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="??????"
                                            onChange={e => this.onChange(e,'bossId')}
                                            defaultValue = {this.state.adminName}
                                        >
                                            {this.state.admin.map((adminData, i) => {
                                                return(
                                                    <MenuItem value={adminData.korName}>{adminData.korName}</MenuItem>
                                            )})}
                                        </Select>
                                        </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell key={employeeData.workType}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="????????????"
                                            onChange={e => this.onChange(e,'workType')}
                                            defaultValue = {this.state.workName}
                                        >
                                            <MenuItem value='?????????'>?????????</MenuItem>
                                            <MenuItem value='?????????'>?????????</MenuItem>                                              
                                        </Select>
                                        </TableCell>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>?????????</TableCell>
                                        <TableCell key={employeeData.workPlaceName}>
                                        <Select 
                                            value={this.state.selectValue}
                                            label="?????????"
                                            onChange={e => this.onChange(e,'workPlace')}
                                            defaultValue = {employeeData.workPlaceName}
                                           >
                                            {this.state.workPlace.map((workplaceData, i) => {
                                                return(
                                                    <MenuItem value={workplaceData.name}>{workplaceData.name}</MenuItem>
                                            )})}
                                        </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align='right' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell align='center' colSpan = "4">
                                            <Input 
                                                onChange={e => this.onChange(e,'project')}
                                                align='center' 
                                                readOnly='true' 
                                                value={this.state.projectName} 
                                                fullWidth={true}>
                                            </Input> 
                                            </TableCell>
                                            <TableCell align='rigth' >
                                                <ProjectList
                                                    recvProjectData={this.recvProjectData}
                                                />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' style={{fontWeight:'bold'}}>?????????</TableCell>
                                        <TableCell key={this.state.updateDepartment}>
                                            <TextField
                                            label={this.state.updateDepartment}
                                            variant="outlined"
                                            size="small"
                                           />
                                        </TableCell>
                                        <TableCell align='right' colSpan='3' style={{fontWeight:'bold'}}>????????????</TableCell>
                                        <TableCell align='left'><TextField
                                            label={employeeData.password}
                                            variant="outlined"
                                            size="small"
                                            onChange={e => this.onChange(e,'password')}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell key="button" colSpan='6' align='right'>
                                            <Button type= "submit" variant="contained">??????</Button>
                                            <span> </span>
                                            <Button onClick ={this.deleteEmployee} variant="contained">??????</Button>
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