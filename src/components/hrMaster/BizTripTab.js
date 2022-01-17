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
        console.log('in constructor');

        this.state = {
            modalOpen: false,
            isFile: false,
            data: [],
            rootUrl: "/api/v1/",
            value: 0,
            id:null
        }

        console.log(this.state);
    }
    componentDidMount() {
        const user = authService.getCurrentUser();  
        if(user){
            this.getMyData();
            this.setState({id:authService.getCurrentUser().id});
        }
    }

    getMyData = async () => {
        let data = await axios.get('/biztrip/employee/'+this.state.id,{ headers: authHeader() });
        data = data.data;
        console.log('this project data is ' + JSON.stringify(data));
    };

    render() {

        return (
            <div>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align='center'>요청번호</TableCell>
                            <TableCell align='center'>출장기간</TableCell>                 
                            <TableCell align='center'>출장번호</TableCell>
                            <TableCell align='center'>출장목적</TableCell>
                            <TableCell align='center'>결재자</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell align='center'>요청번호 데이터</TableCell>
                            <TableCell align='center'>출장기간 데이터</TableCell>                 
                            <TableCell align='center'>출장번호 데이터</TableCell>
                            <TableCell align='center'>출장목적 데이터</TableCell>
                            <TableCell align='center'>결재자 데이터</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>


            </div>
        )
    }
}
export default BizTripTab;