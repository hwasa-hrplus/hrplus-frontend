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
import { Tab, Tabs } from '@mui/material';
import TabPanel from './TabPanel';
import HrMasterTab from './HrMasterTab';
import BizTripTab from './BizTripTab';

class HrInfo extends Component {
    constructor(props) {
        super(props);
        console.log('in constructor');

        this.state = {
            isFile : false,    
            data: [],
            rootUrl:"/api/v1/hrmaster",
            value: 0
        }

        console.log(this.state);
    }

    getMyData = async () => {
        let data = await axios.get(this.state.rootUrl+'/hradmin/admin/list/300108');
        data = data.data;

        this.updateStartDate(data)
        this.getImage()

        //state 저장
        this.setState({data});
        console.log(this.state);      
    };

    updateStartDate = (data) => {
        const date = data.map((updateData) => updateData.startDate);
        const removeIndex = date[0].substring(0, date[0].indexOf('T'));
        this.setState({updateStartDate: removeIndex});
        return this.state.startDate;
    }

    //사진 업로드 구현
    postImage = async(e) =>{
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("img", file);
        
        await axios.post(this.state.rootUrl+'/hradmin/image', formData)
            .then(res =>{
                console.log(res);
            })
 
    }

    getImage = async () =>{
      
        await axios({
            method:'GET',
            url:this.state.rootUrl+'/hradmin/image/300108',
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

    componentDidMount() {
        this.getMyData();
    }

  
    a11yProps = (index) => {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    } 

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    }

    render(){
        return (
            <div>
                <Table>
                {
                    this
                        .state
                        .data
                        .map((employeeData, i) => {
                            return <Table >
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
                <Table style={{marginTop:"30px"}}>
                <Tabs value={this.state.value} onChange={this.handleChange}  left>
                    <Tab label="인사기본"  {...this.a11yProps(0)}/>
                    <Tab label="출장이력"  {...this.a11yProps(1)}/>
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