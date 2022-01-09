import { Input, Table, TableBody, TableCell, TableRow, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react';
import PopupPostCode from './PopupPostCode';

class RegistEmployee extends Component{

    constructor(props) {
        super(props);
        console.log('in constructor');

        this.state = {
            modalOpen: false,
        }

    }


        //사진 업로드 구현
    postImage = async(e) =>{
            const formData = new FormData();
            const file = e.target.files[0];
            formData.append("img", file);
            
            await axios.post('/api/v1/hradmin/image', formData)
                .then(res =>{
                    console.log(res);
                })
     
        }
            //주소 찾기 구현
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }

    //화면 데이터 전송
    onClick = ()=>{
       
        console.log(this.state.data);
    }

    onSubmit = async (e)=>{
        e.preventDefault();
        console.log("onSubmit event 발생");
        const sendData ={
                id:e.target.password.value, 
                korName:e.target.korName.value,
                email:e.target.email.value,
                password:e.target.password.value,
                role:e.target.role.value,
            } 
            console.log(sendData);
        
            axios.post('/api/v1/hradmin/admin', sendData)
            .then((res) => {
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
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align='center'>사진</TableCell>
                        <TableCell align='right'>사번</TableCell>
                        <TableCell key='1'><TextField name='id' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>성별</TableCell>
                        <TableCell key='11'><TextField name='gender' variant="outlined" size="small"/></TableCell>

                    </TableRow>

                    <TableRow >

                        <TableCell align='center' rowSpan='4'>
                            <img
                                src=''
                                alt=""
                                style={{
                                    height: "300px",
                                    width: "250px"
                                }}></img>
                        </TableCell>
                        <TableCell align='right'>성명</TableCell>
                        <TableCell key='3'><TextField name='korName' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>입사일</TableCell>
                        <TableCell key='4'><TextField label=''variant="outlined" size="small"/></TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell align='right'>영문성명</TableCell>
                        <TableCell key='5'><TextField label=''variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>직책</TableCell>
                        <TableCell key='6'><TextField
                            label=''
                            name='role'
                            variant="outlined"
                            size="small"/></TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell align='right'>직급</TableCell>
                        <TableCell key='stafflevel'><TextField
                            name='stafflevel'
                            variant="outlined"
                            size="small"/></TableCell>
                        <TableCell align='right'>직무</TableCell>
                        <TableCell key='8'><TextField
                            label=''
                            variant="outlined"
                            size="small"/></TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell align='right'>주민번호</TableCell>
                        <TableCell key='9'><TextField label='' variant="outlined" size="small"/></TableCell>
                        <TableCell align='right'>연령</TableCell>
                        <TableCell key='10'><TextField label='' variant="outlined" size="small"/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center'>
                            <Input type="file" acept="img/*" onChange={this.postImage}/> {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}
                        </TableCell>
                        <TableCell align='right'>부서</TableCell>
                        <TableCell colSpan='3' key='2'>
                            <TextField
                                style ={{width: '70%'}}
                                label=''
                                variant="outlined"
                                fullWidth={true}
                                size="small"/>
                        </TableCell>
                    </TableRow>

                </TableBody>

             </Table>
             <Table>
                 <TableBody>
                     <TableRow>
                         <TableCell align='right'>생년월일</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>이메일</TableCell>
                         <TableCell key=''><TextField name='email' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>휴대폰</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                     </TableRow>
                     <TableRow >
                         <TableCell align='right'>주소</TableCell>

                         <TableCell align='left' colSpan='5' key=''>
                             <Button variant="contained" onClick={this.openModal}>우편번호 검색</Button>
                             <PopupPostCode
                                 open={this.state.modalOpen}
                                 close={this.closeModal}
                                 address=''
                                 address_code=''
                                 address_detail =''
                                 />
                             <TextField
                                 label=''
                                 variant="outlined"
                                 size="small"/>
                             <span>
                                 <br/>
                             </span>
                             <TextField
                                 label=''
                                 variant="outlined"
                                 style ={{width: '53%'}}
                                 size="small"/>
                             <span>
                                 <br/>
                             </span>
                             <TextField
                                 label=''
                                 variant="outlined"
                                 style ={{width: '53%'}}
                                 size="small"/>
                         </TableCell>

                     </TableRow>
                     <TableRow>
                         <TableCell align='right'>결재권자</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>근무형태</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>주재지</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                     </TableRow>
                     <TableRow >

                         <TableCell align='right'>프로젝트</TableCell>
                         <TableCell align='left' colSpan='5'>
                             <Button variant="contained">프로젝트 찾기</Button>
                             <span><br/></span>
                             <TextField
                                 label=""
                                 style={{width: '53%'}}
                                 size="small"
                                 variant="outlined"/>
                         </TableCell>
                     </TableRow>
                     <TableRow>
                         <TableCell align='right'>Cost Center</TableCell>
                         <TableCell ><TextField label="" variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>원부서</TableCell>
                         <TableCell key=''>
                             <TextField label='' variant="outlined" size="small"/></TableCell>
                         <TableCell align='right'>근무장소</TableCell>
                         <TableCell key=''><TextField label='' variant="outlined" size="small"/></TableCell>
                     </TableRow>
                     <TableRow>
                        <TableCell key="password" colSpan='4' align='right'>초기 비밀번호
                             </TableCell>
                        <TableCell>
                            <TextField name='password'  variant="outlined" size="small"/>
                        </TableCell>
                         <TableCell key="button" align='center'>
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