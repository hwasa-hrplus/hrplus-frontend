import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableCell, Input, Button, NativeSelect, Checkbox } from '@material-ui/core';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class BizTripDetail extends Component {

    
    constructor(props) {
    super(props);
    console.log('in constructor');

    this.state = {
        data: [],
        startDate:new Date(),
        endDate:new Date(),
        p_data:[],
        selectList:[],
        };
    }

    getBizTripList = async()=>{
        let p_data = await axios.get('/api/v1/biztrip/employee/300112');
        p_data = p_data.data;
        console.log('this project data is ' + JSON.stringify(p_data));
        this.setState({p_data:p_data});

         const list =  this.state.p_data.filter((e)=>{
            console.log('DB: '+ new Date(e.endDate).toString() +'vs  <=  달력: '+ new Date(this.state.endDate).toString());
            console.log( new Date(e.endDate).toString() <= new Date(this.state.endDate).toString());



            // if((new Date(e.endDate).toString() <= new Date(this.state.startDate).toString() ) 
            //         &&  (new Date(e.startDate).toString() <= new Date(this.state.endDate).toString()))
            
            
            if((new Date(this.state.startDate).toString() <= new Date(e.startDate).toString() && new Date(e.startDate).toString() <= new Date(this.state.endDate).toString())
         || (new Date(this.state.endDate).toString() <= new Date(e.endDate).toString() && new Date(e.endDate).toString() <= new Date(this.state.endDate).toString()) 
         )
            {
                console.log('filer list id : '+e.id);
                
                return e;
            }
         })
         
         
        console.log(list);
        
        this.setState({selectList:list})

        list.map((ProjectData, i) => 
        console.log('map id '+ProjectData.id))
    
    }
 

    getMyData = async () => {
        let data = await axios.get('/api/v1/hrmaster/hradmin/admin/list/300112');
        data = data.data;
        console.log('this employee data is ' + JSON.stringify(data));

        this.setState({data});
        this.setState({startDate:new Date(this.state.startDate.getFullYear()-1, 0, 1)})
        console.log(this.state.startDate.getFullYear()-1);
        
    };



    componentDidMount() {
        console.log('in componentDidMount');    
        this.getMyData();
        }
    
        componentDidUpdate() {
        console.log('in componentDidUpdate');
        }
    
        componentWillUnmount() {
        console.log('in componentWillUnmount');
        }
    
    render() {
        
        return (
            <div>
            <Table>
            
                <TableBody>
            {
                this.state.data.map((employeeData, i) => 
                <TableRow>
                    <TableCell align='right'>사번</TableCell>
                    <TableCell align='left'>{employeeData.id}</TableCell>
                    <TableCell align='right'>성명</TableCell>
                    <TableCell align='left'>{employeeData.korName}</TableCell>
                    <TableCell align='right'>부서</TableCell>
                    <TableCell align='left'>{employeeData.departmentName}</TableCell>
                </TableRow>
                )
            }
                <TableRow>
                    <TableCell align='right'>조회기간</TableCell>
                    <TableCell></TableCell>
                    <TableCell  colSpan='4' >
                       <td>
                            <div >
                           
                            <ReactDatePicker
                                dateFormat="yyyy년 MM월 dd일"
                                selected={this.state.startDate}
                                onChange={(date) => this.setState({startDate:date})}
                                selectsStart
                                minDate={new Date(this.state.startDate.getFullYear()-10, 0, 1)}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                            />
                            </div>
                            </td>
                            <td ><h5>&nbsp;&nbsp; ~ &nbsp;&nbsp;</h5></td>
                            <td >
                            <div>
                            <ReactDatePicker
                                dateFormat="yyyy년 MM월 dd일"
                                selected={this.state.endDate}
                                onChange={(date) => this.setState({endDate:date})}
                                selectsEnd
                                minDate={this.state.startDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                            />
                            </div>
                            </td>
                    </TableCell>
                   
                </TableRow>
                <span><br/></span>

                <TableRow>
                <td align ='right' colSpan='6'>
                        <Button  onClick={this.getBizTripList} variant="contained">조회</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </td>
                </TableRow>
                </TableBody>
                </Table>


                <Table>
                
                <TableRow>
                    <TableCell align='center'>요청번호</TableCell>
                    <TableCell align='center'>프로젝트명</TableCell>
                    <TableCell align='center'>출장기간</TableCell>
                    <TableCell align='center'>출장목적</TableCell>
                    <TableCell align='center'>결재권자</TableCell>
                    <TableCell align='center'>승인여부</TableCell>
                </TableRow>
                {
                this.state.selectList.map((ProjectData, i) => 
                <TableRow>
                   
                    <TableCell align='center' key ={i}>{ProjectData.id}</TableCell>
                    <TableCell align='center'>{ProjectData.project.name}</TableCell>
                    <TableCell align='center'>{new Date(ProjectData.startDate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })} ~ {new Date(ProjectData.endDate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                  })}</TableCell>
                    <TableCell align='center'>{ProjectData.bizPurpose.name}</TableCell>
                    <TableCell align='center'>{ProjectData.bossId}</TableCell>
                    {ProjectData.approved === 0 ?
                    <TableCell align='center'>승인</TableCell>
                        :<TableCell align='center'>미승인</TableCell>

                    }
                </TableRow>
                )
            }
            
        </Table>
        </div>
        );
    }
}

export default BizTripDetail;
