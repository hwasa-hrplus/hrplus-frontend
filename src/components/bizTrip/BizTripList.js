import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableCell,  } from '@material-ui/core';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import authService from '../../services/auth.service';
import authHeader from '../../services/auth-header';
import { Button } from '@mui/material';
class BizTripList extends Component {
    constructor(props) {
    super(props);

    this.state = {
        data: [],
        data2:[],
        minDate:0,
        startDate:new Date(),
        endDate:new Date(),
        p_data:[],
        selectList:[],
        };
    }

    getBizTripList = async()=>{

        const user = authService.getCurrentUser();  
        let p_data = await axios.get('/api/v1/biztrip/employee/'+user.id);
        p_data = p_data.data;
        console.log('this project data is ' + JSON.stringify(p_data));
        this.setState({p_data:p_data});

         const list =  this.state.p_data.filter((e)=>{
            console.log('DB: '+ new Date(e.endDate) +'vs  <=  달력: '+ new Date(this.state.endDate));
            console.log( new Date(e.endDate).toString() <= new Date(this.state.endDate).toString());

            if((new Date(e.startDate) >= new Date(this.state.startDate)) 
                    &&  (new Date(e.endDate) <= new Date(this.state.endDate)))
            {
                console.log('filer list id : '+e.id);
                return e;
            }
         })
         
         
       this.setState({selectList:list})
    }

    getMyData = async () => {

        const user = authService.getCurrentUser();  
        console.log(this.state.startDate)
        this.setState({startDate:new Date(this.state.startDate.getFullYear()-1, 0, 1)})

        let data2 =  await axios.get('/api/v1/hrmaster/hrfixed/'+user.id, { headers: authHeader() });
        data2 = data2.data;
        console.log('this employee fixed data is ' + JSON.stringify(data2));
         this.setState({id:data2.id});
         this.setState({korName:data2.korName})
         this.setState({departmentName:data2.departmentName})
         console.log("!!!!!!!!!!id"+this.state.id);



        const date = this.state.startDate;
        console.log("as: "+this.state.startDate)
        this.getTest(date)

    };

    getTest = (date) =>{
        console.log('sd: '+ date);
        
        this.setState({minDate:new Date(date.getFullYear()-1, 0, 1)})
        console.log(this.state.minDate)
    }

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
              
                <TableRow>
                    <TableCell align='right'>사번</TableCell>
                    <TableCell align='left'>{this.state.id}</TableCell>
                    <TableCell align='right'>성명</TableCell>
                    <TableCell align='left'>{this.state.korName}</TableCell>
                    <TableCell align='right'>부서</TableCell>
                    <TableCell align='left'>{this.state.departmentName}</TableCell>
                </TableRow>
              
             <TableRow>
                    <TableCell align='right'>조회기간</TableCell>
                    <TableCell></TableCell>
                    <TableCell  colSpan='4' >
                       <td>
                            <div >
                  
                            <ReactDatePicker
                                dateFormat="yyyy년 MM월 dd일"
                                selected={this.state.minDate}
                                onChange={(date) => this.setState({startDate:date})}
                                selectsStart
                                minDate={this.state.minDate}
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
                                minDate={this.state.minDate}
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
                    <TableCell align='center' key={i}>{ProjectData.bizPurpose.name}</TableCell>                 
                    {ProjectData.approved === false ?
                    <TableCell align='center'>미승인</TableCell>
                        :<TableCell align='center'>승인</TableCell>

                    }
                </TableRow>
                )
            }
            
        </Table>
        

        </div>
        );
    }
}

export default BizTripList;
