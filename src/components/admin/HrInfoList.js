import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import React, { PureComponent } from 'react';
import DepartmentChart from './Chart/DepartmentChart';
import ProjectChart from './Chart/ProjectChart';
import StaffLevelChart from './Chart/StaffLevelChart';
import TotalEmployeeTable from './Chart/TotalEmployeeTable';

export default class HrInfoList extends PureComponent {

  constructor(){
    super();
    this.state=({
      clickedBtnName : 'TotalEmployee',
      BtnVariantTotalEmployee: 'contained',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'outlined',
    });
  }

  findTotalEmployee = ()=>{
    console.log('전체 조회 버튼 클릭!');
    this.setState({
      clickedBtnName : 'TotalEmployee',

      BtnVariantTotalEmployee: 'contained',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'outlined',
    });
    return ("");
  }

  findByProject = ()=>{
    console.log('프로젝트별 조회 버튼 클릭!');
    this.setState({
      clickedBtnName : 'Project',

      BtnVariantTotalEmployee: 'outlined',
      BtnVariantProject: 'contained',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'outlined',
    });
    return (
      ""
    );
  }
  
  findByDepartment = ()=>{
    console.log('부서별 조회 버튼 클릭!');
    this.setState({
      clickedBtnName : 'Department',

      BtnVariantTotalEmployee: 'outlined',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'contained',
      BtnVariantStaffLevel: 'outlined',
    });
    return (
      ""
    );
  }
  
  findByStaffLevel = ()=>{
    console.log('직급별 조회 버튼 클릭');
    this.setState({
      clickedBtnName : 'StaffLevel',

      BtnVariantTotalEmployee: 'outlined',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'contained',
    });
    return (
      ""
    );
  }

  findTableByBtn = (clickedBtnName) =>{
    console.log('findTableByBtn 함수 실행!');
    
    switch (clickedBtnName){
      case 'TotalEmployee':
        return (<TotalEmployeeTable/>);

      case 'Project':
        return (<ProjectChart/>);

      case 'Department':
        return (<DepartmentChart/>);

      case 'StaffLevel':
        return (<StaffLevelChart/>);

      default:
        return ""
    }
  }
  

  render() {
    return (
      <div className="ContentWrapper">
        <div align="left" className='buttonWrapper'>
          <ButtonGroup variant="contained" aria-label="chartButtonGroup" sx={{ alignContent: 'center' }}>
              <Button onClick={this.findTotalEmployee} variant={this.state.BtnVariantTotalEmployee}> 전체 </Button> 
              <Button onClick={this.findByProject} variant={this.state.BtnVariantProject}> 프로젝트 </Button> 
              <Button onClick={this.findByDepartment} variant={this.state.BtnVariantDepartment}> 부서 </Button> 
              <Button onClick={this.findByStaffLevel} variant={this.state.BtnVariantStaffLevel}> 직급 </Button><br/>
          </ButtonGroup>
        </div>
        <div>
          {this.findTableByBtn(this.state.clickedBtnName)}
        </div>
      </div>
    );
  }
}