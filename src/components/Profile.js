import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Input,

} from '@material-ui/core';
import axios from 'axios';

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log('in constructor');

        this.state = {
            modalOpen: false,
            isFile : false,    
            data: []
        }

        console.log(this.state);
    }

    getMyData = async () => {
        let data = await axios.get('/hradmin/admin/list/300108');
        data = data.data;

        //workType 구현
        const workType = data.map((updateData) => updateData.workType);
        if (workType[0] === true) {
            this.setState(data.map((updateData) => updateData.workType = "재직"));
        } else {
            this.setState(data.map((updateData) => updateData.workType = "휴직"));
        }

        this.updateBirthDate(data);
        this.updateStartDate(data)
        this.updateDepartment(data);
        this.searchAdmin(data);
        this.getImage()
    

        //우편번호
        this.setState({
            address: data.map((employeeData) => employeeData.address),
            address_code: data.map((employeeData) => employeeData.address_code),
            address_detail: data.map((employeeData) => employeeData.detail_address),

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
        this.setState({"updateBirthDate": removeIndex});
        return this.state.birthDate;
    }

    updateStartDate = (data) => {
        const date = data.map((updateData) => updateData.startDate);
        const removeIndex = date[0].substring(0, date[0].indexOf('T'));
        this.setState({"updateStartDate": removeIndex});
        return this.state.startDate;
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
        formData.append("img", file);
        
        await axios.post('/hradmin/image', formData)
            .then(res =>{
                console.log(res);
            })
 
    }

    getImage = async () =>{
      
        await axios({
            method:'GET',
            url:'/hradmin/image/300108',
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
        let bossData = await axios.get('/hradmin/admin/list/'+admin[0]);
        bossData = bossData.data
        console.log(bossData);

        const adminName = bossData.map((updateData) => updateData.korName);
        this.setState({adminName:adminName})
    }
 
    componentDidMount() {
        this.getMyData();
    }

    render(){
        return (
            <div>
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
                                        <TableCell key={i}>{employeeData.id}</TableCell>
                                        <TableCell align='right'>성별</TableCell>
                                        <TableCell key={employeeData.gender}>{employeeData.gender}</TableCell>
                                    </TableRow>

                                    <TableRow >     
                                        <TableCell align='center' rowSpan='4'><img src={this.state.setUrl} alt="" style={{height:"300px", width:"250px"}}></img></TableCell>                                     
                                        <TableCell align='right'>성명</TableCell>
                                        <TableCell key={employeeData.korName}><TextField label={employeeData.korName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>입사일</TableCell>
                                        <TableCell key={this.state.updateStartDate}>{this.state.updateStartDate}</TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>영문성명</TableCell>
                                        <TableCell key={employeeData.engName}><TextField label={employeeData.engName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>직책</TableCell>
                                        <TableCell key={employeeData.role}>{employeeData.role}</TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>직급</TableCell>
                                        <TableCell key={employeeData.staffLevelName}>{employeeData.staffLevelName}</TableCell>
                                        <TableCell align='right'>직무</TableCell>
                                        <TableCell key={employeeData.jobCategoryName}>{employeeData.jobCategoryName}</TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>주민번호</TableCell>
                                        <TableCell key={employeeData.residentNum}>{employeeData.residentNum}</TableCell>
                                        <TableCell align='right'>연령</TableCell>
                                        <TableCell key={employeeData.age}>{employeeData.age}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'>
                                            <Input type = "file" acept="img/*" onChange={this.postImage}/>
                                            {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}
                                            
                                        </TableCell>
                                        <TableCell align='right'>부서</TableCell>
                                        <TableCell colSpan='3' key={employeeData.departmentName}>{employeeData.departmentName}</TableCell>
                                    </TableRow>

                                </TableBody>

                            </Table>
                        })

                }
        </div>
        )
    }
    
};

export default Profile;