import { Table, TableCell, TableHead, TableRow,  Button,} from '@material-ui/core';
import axios from 'axios';
import Modal from 'react-modal';
import React, { Component } from 'react';

class ProjectList extends Component {
    constructor(props) {
        super(props);
        console.log('in constructor');

         this.state = {
        data: [],
        modalIsOpen: false,
        selectValue:[]
        }
    }
    

    sendProjectData = ()=>{
        this.props.recvProjectData(this.state.selectValue);
        // console.log(this.state.selectValue);
        this.setState({modalIsOpen: false});
        
    }
    handleChange = (e) => {
        console.log(`*****handleChange*****`);
        console.log(`선택한 값 : ${e.target.value}`);
    
        this.setState({
          selectValue: e.target.value
        }, ()=>console.log('selectValue : '+this.state.selectValue));

        
        console.log('value: '+e.target.value);
        
      };

    getMyData = async () => {
        let data = await axios.get('/api/v1/biztrip/project/list');
        data = data.data;
        console.log('here data is ' + JSON.stringify(data));
        this.setState({data});

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
                 <Button variant="contained" onClick={()=> this.setState({modalIsOpen:true})} >조회</Button>
       <Modal isOpen={this.state.modalIsOpen} onRequestClose={() =>  this.setState({modalIsOpen: false})}
        style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
            content: {
              width: "700px",
              height: "500px",
              position: "absolute",
              top: "40%",
              left: " 50%",
              transform: "translate(-50%, -50%)",
              border: "1px solid #eee",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              outline: "none",
              padding: "20px",
              textAlign: "center",
            },}}
       >
          

           <h4 align='center'>프로젝트 코드를 선택해주세요.</h4>
           <div >
       <Table style={{
            width:'100%',
           }}>
            <TableHead>
                 <TableRow>
                    <TableCell align='left' >선택</TableCell>
                     <TableCell align='center'>프로젝트 코드</TableCell>
                     <TableCell align='center'>프로젝트명</TableCell>
                     <TableCell align='center' >Cost Center</TableCell>
                 </TableRow>
           </TableHead>
            {this.state.data.map( (ProjectData, index) =>
                <TableRow>
                    <TableCell>
                        
                    <input  align="center"
                            id="project_code"
                            value={ProjectData.name}
                            name="platform"
                            type="radio"
                            checked={this.state.selectValue === ProjectData.name}
                            onChange={this.handleChange}
                        />
                    </TableCell>
                    <TableCell  key = {index} align='center'>{ProjectData.code}</TableCell>
                    <TableCell align='center'>{ProjectData.name}</TableCell>
                    <TableCell align='center'>{ProjectData.costCenter}</TableCell>

                </TableRow>
            )}
                <TableRow>
                    <TableCell align='right' colSpan='4'>
                        <Button variant="contained" onClick={this.sendProjectData}>확인</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="contained" onClick={()=> this.setState({modalIsOpen: false})}>취소</Button>
                    </TableCell>
                </TableRow>

        </Table>
        </div>
       
      </Modal>
            </div>
        );
    }
}

export default ProjectList;