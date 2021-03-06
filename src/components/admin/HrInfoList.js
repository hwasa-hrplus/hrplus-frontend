import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import React, { PureComponent } from 'react';
import DepartmentChart from './Chart/DepartmentChart';
import ProjectChart from './Chart/ProjectChart';
import StaffLevelChart from './Chart/StaffLevelChart';
import EmployeeTable from './Chart/EmployeeTable';
import JobCategoryChart from './Chart/JobCategoryChart';


export default class HrInfoList extends PureComponent {

  constructor(){
    super();
    this.state=({
      clickedBtnName : 'TotalEmployee',
      BtnVariantTotalEmployee: 'contained',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'outlined',
      BtnVariantJobCategory: 'outlined',
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
      BtnVariantJobCategory: 'outlined',
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
      BtnVariantJobCategory: 'outlined',
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
      BtnVariantJobCategory: 'outlined',
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
      BtnVariantJobCategory: 'outlined',
    });
    return (
      ""
    );
  }

  findByJobCategory = () =>{
    console.log('직무별 사원 조회 버튼 클릭');
    this.setState({
      clickedBtnName : 'JobCategory',
      BtnVariantTotalEmployee: 'outlined',
      BtnVariantProject: 'outlined',
      BtnVariantDepartment: 'outlined',
      BtnVariantStaffLevel: 'outlined',
      BtnVariantJobCategory: 'contained',
    });
    return (
      ""
    );
  }

  findChartByBtn = (clickedBtnName) =>{
    console.log('findChartByBtn 함수 실행!');
    
    switch (clickedBtnName){
      case 'TotalEmployee':
        return (<EmployeeTable/>);

      case 'Project':
        return (<ProjectChart/>);

      case 'Department':
        return (<DepartmentChart/>);

      case 'StaffLevel':
        return (<StaffLevelChart/>);
      case 'JobCategory':
        return (<JobCategoryChart/>)
      default:
        return ""
    }
  }
  
  render() {
    return (
      <div className="ContentWrapper">
        <div className='buttonWrapper' >
          <ButtonGroup
            variant="contained"
            align='left'
            style={{ 
              width:'350px',
              display: 'flex',
              }}
            >
              <Button style={{marginLeft:'3px'}} onClick={this.findTotalEmployee} variant={this.state.BtnVariantTotalEmployee}> 전체 </Button> 
              <Button style={{marginLeft:'3px'}}onClick={this.findByProject} variant={this.state.BtnVariantProject}> 프로젝트 </Button> 
              <Button style={{marginLeft:'3px'}}onClick={this.findByDepartment} variant={this.state.BtnVariantDepartment}> 부서 </Button> 
              <Button style={{marginLeft:'3px'}} onClick={this.findByStaffLevel} variant={this.state.BtnVariantStaffLevel}> 직급 </Button>
              <Button style={{marginLeft:'3px'}}onClick={this.findByJobCategory} variant={this.state.BtnVariantJobCategory}> 직무 </Button>
          </ButtonGroup>
        </div>
        <div>
          {this.findChartByBtn(this.state.clickedBtnName)}
        </div>
      </div>
    );
  }
}