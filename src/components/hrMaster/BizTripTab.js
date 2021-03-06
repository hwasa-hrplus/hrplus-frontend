import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,

} from '@material-ui/core';
import authService from '../../services/auth.service';
import axios from 'axios';
import authHeader from '../../services/auth-header';


class BizTripTab extends Component {
    constructor(props) {
        super(props);
        const user = authService.getCurrentUser();  
        this.state = {
            modalOpen: false,
            isFile: false,
            data: [],
            rootUrl: "/api/v1/",
            value: 0,
            id: user?user.id:null
        }

        console.log(this.state);
    }
    componentDidMount() {
        this.getMyData();
    }

    getMyData = async () => {
        let data = await axios.get(this.state.rootUrl+'biztrip/employee/'+this.state.id,{ headers: authHeader() });
        data = data.data;
        console.log('this project data is ' + JSON.stringify(data));
        this.setState({data})
        this.updateStartDate(data)
        this.updateEndDate(data)
        this.searchAdmin(data)
    };

    updateStartDate = (data) => {
        const date = data.map((updateData) => updateData.startDate);
        const removeIndex = date[0].substring(0, date[0].indexOf('T'));
        this.setState({updateStartDate: removeIndex});
    }

    updateEndDate = (data) => {
        const date = data.map((updateData) => updateData.endDate);
        const removeIndex = date[0].substring(0, date[0].indexOf('T'));
        this.setState({updateEndDate: removeIndex});
    }

    searchAdmin = async (data)=>{

        const admin = data.map((updateData) => updateData.bossId);
        console.log(data)
        let bossData = await axios.get(this.state.rootUrl+'hrmaster/hrfixed/'+admin[0], { headers: authHeader() });
        bossData = bossData.data
        this.setState({adminName:bossData.korName})
    }


    render() {

        return (
            <div>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align='center' style={{fontWeight:'bold'}}>????????????</TableCell>
                            <TableCell align='center' style={{fontWeight:'bold'}}>????????????</TableCell>                 
                            <TableCell align='center' style={{fontWeight:'bold'}}>????????????</TableCell>
                            <TableCell align='center' style={{fontWeight:'bold'}}>????????????</TableCell>
                        </TableRow>
                        {   this
                            .state
                            .data
                            .map((employeeData, i) => {
                                return(
                                    <TableRow >
                                    <TableCell align='center'>{employeeData.id}</TableCell>
                                    <TableCell align='center'>{this.state.updateStartDate} - {this.state.updateEndDate}</TableCell>                 
                                    <TableCell align='center'>{employeeData.bizPurpose.name}</TableCell>
                                    <TableCell align='center'>{this.state.adminName}</TableCell>
                                </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>


            </div>
        )
    }
}
export default BizTripTab;