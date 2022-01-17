import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Input,

} from '@material-ui/core';
import axios from 'axios';
import {Tab, Tabs} from '@mui/material';
import TabPanel from './TabPanel';
import HrMasterTab from './HrMasterTab';
import BizTripTab from './BizTripTab';
import authHeader from '../../services/auth-header';
import authService from '../../services/auth.service';
import { Button } from '@mui/material';

class HrInfo extends Component {
    constructor(props) {
        super(props);
        const user = authService.getCurrentUser();
        this.state = {
            isFile: false,
            data: [],
            rootUrl: "/api/v1",
            value: 0,
            updateStartDate: "",
            id:user?user.id:null
        }

        console.log(this.state);
    }

    getMyData = async () => {
        let data = await axios.get(
            this.state.rootUrl + '/hrmaster/hrfixed/' + this.state.id,
            {headers: authHeader()}
        );

        data = data.data;
        console.log(data)
    
        this.setState({
            korName:data.korName,
            engName:data.engName,
            filesId:data.filesId
        }
        )

        this.updateStartDate(data)
        this.getImage()

        //state 저장
        this.setState({data});
        console.log(this.state);
    };

    updateStartDate = (data) => {
        const date = data.startDate;
        const removeIndex = date.substring(0, date.indexOf('T'));
        this.setState({updateStartDate: removeIndex});
        console.log(date)
    }

      //사진 업로드 구현
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

    onChange = (e, type) => {
        const value = e.target.value;
        if (type === 'korName') {
            this.setState({korName: value})
        }else if(type==='engName'){
            this.setState({engName:value})
        }
    }

    getImage = async () => {

        await axios({
            method: 'GET',
            url: this.state.rootUrl + '/hrmaster/hradmin/image/' + this.state.id,
            responseType: 'blob',
            headers: authHeader()
        })
            .then((res) => {
                const url = window
                    .URL
                    .createObjectURL(new Blob([res.data], {type: res.headers['content-type']}));
                this.setState({setUrl: url})
                console.log(res)

            })
            .catch(e => {
                console.log(`error === ${e}`)
            })
      

    }

    componentDidMount() {
        const user = authService.getCurrentUser();  
        if(user){
            this.getMyData();
            this.setState({id:authService.getCurrentUser().id});
        }
    }

    a11yProps = (index) => {
        return {id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`};
    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    }

    //화면 데이터 전송
    onSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target)
        console.log("onSubmit event 발생");
        console.log(this.state);

        const sendData = {
            korName:this.state.korName,
            engName:this.state.engName,
            filesId:this.state.filesId
        }
        console.log(sendData);
        axios
            .put(
                this.state.rootUrl + '/hrmaster/hrfixed/' + this.state.id,
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
        return (
            <div>
                <Table>

                    <Table >
                        {/* <TableHead></TableHead> */}
                        <TableBody>
                            <TableRow>
                                <TableCell align='center'>사진</TableCell>
                                <TableCell align='right'>사번</TableCell>
                                <TableCell key={this.state.data.id}>{this.state.data.id}</TableCell>
                                <TableCell align='right'>성별</TableCell>
                                <TableCell key={this.state.data.gender}>{this.state.data.gender}</TableCell>
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
                                <TableCell key={this.state.korName}>
                                     <TextField 
                                                name='korName' 
                                                onChange={e => this.onChange(e,'korName')}
                                                label={this.state.korName}
                                                variant="outlined" 
                                                size="small"/>
                                </TableCell>
                                <TableCell align='right'>입사일</TableCell>
                                <TableCell key={this.state.updateStartDate}>{this.state.updateStartDate}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell align='right'>영문성명</TableCell>
                                <TableCell key={this.state.engName}>
                                   <TextField 
                                                name='engName' 
                                                onChange={e => this.onChange(e,'engName')}
                                                label={this.state.engName}
                                                variant="outlined" 
                                                size="small"/>
                                </TableCell>
                                <TableCell align='right'>직책</TableCell>
                                <TableCell key={this.state.data.role}>{this.state.data.role}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell align='right'>직급</TableCell>
                                <TableCell key={this.state.data.staffLevelName}>{this.state.data.staffLevelName}</TableCell>
                                <TableCell align='right'>직무</TableCell>
                                <TableCell key={this.state.data.jobCategoryName}>{this.state.data.jobCategoryName}</TableCell>
                            </TableRow>
                            <TableRow>

                                <TableCell align='right'>주민번호</TableCell>
                                <TableCell key={this.state.data.residentNum}>{this.state.data.residentNum}</TableCell>
                                <TableCell align='right'>연령</TableCell>
                                <TableCell key={this.state.data.age}>{this.state.data.age}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='center'>
                                    <Input type="file" acept="img/*" onChange={this.postImage}/> {/* <IconButton aria-label="upload picture" component="span"></IconButton> */}

                                </TableCell>
                                <TableCell align='right'>부서</TableCell>
                                <TableCell colSpan='3' key={this.state.data.departmentName}>{this.state.data.departmentName}</TableCell>
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

                    <Table
                        style={{
                            marginTop: "30px"
                        }}>
                        <Tabs value={this.state.value} onChange={this.handleChange} left="left">
                            <Tab label="인사기본" {...this.a11yProps(0)}/>
                            <Tab label="출장이력" {...this.a11yProps(1)}/>
                        </Tabs>
                        <TabPanel value={this.state.value} index={0}>
                            <HrMasterTab/>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <BizTripTab/>
                        </TabPanel>

                    </Table>
                </Table>
            </div>
        )
    }
};

export default HrInfo;