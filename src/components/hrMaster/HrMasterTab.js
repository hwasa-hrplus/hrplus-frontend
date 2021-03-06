import React, {Component} from 'react';
import {Table, TableBody, TableRow, TableCell, TextField} from '@material-ui/core';
import {Button} from '@mui/material';
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
            data: [],
            rootUrl: "/api/v1",
            value: 0,
            project:{},
            address:[],
            addressCode:[],
            id: user?user.id:null
        }
    }

    componentDidMount() {
        this.getMyData(); 
    }

    getMyData = async () => {
        let data = await axios.get(this.state.rootUrl + '/hrmaster/hrbasic/' + this.state.id, {headers: authHeader()});

        data = data.data;
        console.log(data)

        let project = await axios.get(
            this.state.rootUrl + '/biztrip/project/' + this.state.id,
            {headers: authHeader()}
        ); 
        const projectData = project.data;
        this.setState({project: projectData});
        console.log(this.state.project)

        //workType 구현
        const workType = data.workType;
        if (workType === true) {
            this.setState({workType:"근무자"});
        } else {
            this.setState({workType:"휴직자"});
        }

        this.setState({
            address:[data.address],
            addressCode:[data.addressCode],
            addressDetail:data.addressDetail
        })

        this.updateBirthDate(data);
        this.searchAdmin(data);
        this.updateDepartment(data);

        //state 저장
        this.setState({data});
        console.log(this.state);
    };

    onChange = (e, type) => {
        const value = e.target.value;
        if (type === 'addressDetail') {
            this.setState({addressDetail: value})
        }
    }

    updateBirthDate = (data) => {
        const birthDate = data.birthDate;
        const removeIndex = birthDate.substring(0, birthDate.indexOf('T'));
        this.setState({updateBirthDate: removeIndex});
    }

    //주소 찾기 구현
    openModal = () => {
        this.setState({modalOpen: true})
    }
    closeModal = () => {
        this.setState({modalOpen: false})
    }

    //원부서 구현
    updateDepartment = (data) => {
        const department = data.departmentName;
        const splitDepartment = department.split(" ");
        this.setState({updateDepartment: splitDepartment[2]});
    }

        //결재권자 가져오기
        searchAdmin = async (data)=>{

            const admin = data.bossId;
            let bossData = await axios.get(this.state.rootUrl+'/hrmaster/hrfixed/'+admin ,{ headers: authHeader() });
            console.log(bossData.data);
            this.setState({adminName:bossData.data.korName})
        }

    //화면 데이터 전송
    onSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target)
        console.log("onSubmit event 발생");
        console.log(this.state);

        const sendData = {
            id: this.state.id,
            address: this.state.address[0],
            addressCode: this.state.addressCode[0],
            addressDetail: this.state.addressDetail,

        }
        console.log(sendData);
        axios
            .put(
                this.state.rootUrl + '/hrmaster/hrbasic/' + this.state.id,
                sendData,
                {headers: authHeader()}
            )
            .then((res) => {
                alert('사원 정보 수정 완료');
                window
                    .location
                    .reload();
                console.log(res)
            })
            .catch((error) => {
                console.log(error.response)
            })
        }

    render() {

        return (<div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align='right' style={{fontWeight:'bold'}}>생년월일</TableCell>
                        <TableCell key ={this.state.updateBirthDate}>{this.state.updateBirthDate}</TableCell>
                        <TableCell align='right' style={{fontWeight:'bold'}}>이메일</TableCell>
                        <TableCell key ={this.state.data.email}>{this.state.data.email}</TableCell>
                        <TableCell align='right' style={{fontWeight:'bold'}}>휴대폰</TableCell>
                        <TableCell key ={this.state.data.phone}>{this.state.data.phone}</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell align='right' style={{fontWeight:'bold'}}>주소</TableCell>

                        <TableCell align='left' colSpan='5' key={this.state.address}>
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
                                style ={{marginLeft:'10px'}}      
                                size="small"/>
                            <span>
                                <br/>
                            </span>
                            <TextField
                                label={this
                                    .state
                                    .address[0]}
                                variant="outlined"
                                style ={{width: '53%', marginTop:'10px' }}
                                size="small"/>
                            <span>
                                <br/>
                            </span>
                            <TextField
                                label={this.state.addressDetail}
                                onChange={e => this.onChange(e, 'addressDetail')}
                                variant="outlined"
                                style ={{width: '53%', marginTop:'10px' }}
                                size="small"/>

                        </TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell align='right' style={{fontWeight:'bold'}}>결재권자</TableCell>
                        <TableCell key={this.state.adminName}>{this.state.adminName}</TableCell>
                        <TableCell align='right' style={{fontWeight:'bold'}}>근무형태</TableCell>
                        <TableCell key={this.state.workType}>{this.state.workType}</TableCell>
                        <TableCell align='right' style={{fontWeight:'bold'}}>주재지</TableCell>
                        <TableCell key={this.state.data.workPlaceName}>{this.state.data.workPlaceName}</TableCell>
                    </TableRow>
                    <TableRow >

                        <TableCell align='right' style={{fontWeight:'bold'}}>프로젝트</TableCell>
                        <TableCell key={this.state.project.code} align='left'>{this.state.project.code}</TableCell>
                        <TableCell align='right' colSpan='3' style={{fontWeight:'bold'}}>원부서</TableCell>
                        <TableCell key={this.state.data.updateDepartment}>{this.state.updateDepartment}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button
                style={{
                    marginTop: "20px",
                    float: "right"
                }}
                onClick={this.onSubmit}
                variant="contained">수정</Button>
        </div>
        )
    }
}
export default HrMasterTab;