import React, {Component} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
    TextField,
    Input,

} from '@material-ui/core';
import PopupPostCode from './PopupPostCode';

class EmployeeDetail extends Component {

    constructor(props) {
        super(props);
        console.log('in constructor');
        const link = document.location.href;
        const parameter = link.split('/')
        const id = parameter[5] ;
        console.log(id);

        this.state = {
            modalOpen: false,
            id: id,
            isFile : false,    
            data: []
        }

        console.log(this.state);
    }

    getMyData = async () => {
        let data = await axios.get('/hradmin/admin/list/'+this.state.id);
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
            url:'/hradmin/image/'+this.state.id,
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

    render() {
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
                                        <TableCell key={i}><TextField label={employeeData.id} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>성별</TableCell>
                                        <TableCell key={employeeData.gender}><TextField label={employeeData.gender} variant="outlined" size="small"/></TableCell>
                                    </TableRow>

                                    <TableRow >     
                                        <TableCell align='center' rowSpan='4'><img src={this.state.setUrl} alt="" style={{height:"300px", width:"250px"}}></img></TableCell>                                     
                                        <TableCell align='right'>성명</TableCell>
                                        <TableCell key={employeeData.korName}><TextField label={employeeData.korName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>입사일</TableCell>
                                        <TableCell key={this.state.updateStartDate}><TextField label={this.state.updateStartDate} variant="outlined" size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>영문성명</TableCell>
                                        <TableCell key={employeeData.engName}><TextField label={employeeData.engName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>직책</TableCell>
                                        <TableCell key={employeeData.role}><TextField
                                            label={employeeData.role}
                                            variant="outlined"
                                            size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>직급</TableCell>
                                        <TableCell key={employeeData.staffLevelName}><TextField
                                            label={employeeData.staffLevelName}
                                            variant="outlined"
                                            size="small"/></TableCell>
                                        <TableCell align='right'>직무</TableCell>
                                        <TableCell key={employeeData.jobCategoryName}><TextField
                                            label={employeeData.jobCategoryName}
                                            variant="outlined"
                                            size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow>

                                        <TableCell align='right'>주민번호</TableCell>
                                        <TableCell key={employeeData.residentNum}><TextField label={employeeData.residentNum} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>연령</TableCell>
                                        <TableCell key={employeeData.age}><TextField label={employeeData.age} variant="outlined" size="small"/></TableCell>
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
                                        <TableCell key={this.state.updateBirthDate}><TextField label={this.state.updateBirthDate} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>이메일</TableCell>
                                        <TableCell key={employeeData.email}><TextField label={employeeData.email} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>휴대폰</TableCell>
                                        <TableCell key={employeeData.phone}><TextField label={employeeData.phone} variant="outlined" size="small"/></TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align='right'>주소</TableCell>

                                        <TableCell align='left' colSpan='5' key={employeeData.address}>
                                            <Button variant="contained" onClick={this.openModal}>우편번호 검색</Button>
                                            <PopupPostCode
                                                open={this.state.modalOpen}
                                                close={this.closeModal}
                                                address={this.state.address}
                                                address_code ={this.state.address_code}
                                                address_detail ={this.state.address_detail}
                                              
                                                />
                                            <div>
                                                <TextField
                                                  label={this.state.address_code[0]}
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
                                                  label={this.state.address_detail[0]}
                                                  variant="outlined"
                                                  style ={{width: '53%'}}
                                                  size="small"/>
                                            </div>
                                          
                                        </TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right'>결재권자</TableCell>
                                        <TableCell key={this.state.adminName}><TextField label={this.state.adminName} variant="outlined" size="small"/></TableCell>
                                        <TableCell align='right'>근무형태</TableCell>
                                        <TableCell key={employeeData.workType}><TextField label={employeeData.workType} variant="outlined" size="small"/></TableCell>
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
                                        <TableCell align='right'>원부서</TableCell>
                                        <TableCell key={this.state.updateDepartment}>
                                            <TextField
                                            label={this.state.updateDepartment}
                                            variant="outlined"
                                            size="small"
                                           /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell key="button" colSpan='6' align='right'>
                                            <Button variant="contained">수정</Button>
                                            <span> </span>
                                            <Button variant="contained">삭제</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        })
                }
            </div>
        );
    }

}

export default EmployeeDetail;