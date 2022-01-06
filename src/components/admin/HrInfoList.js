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

  findChartByBtn = (clickedBtnName) =>{
    console.log('findChartByBtn 함수 실행!');
    
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
        <div align="center" className='buttonWrapper'>
          <ButtonGroup variant="contained" 
            style={{ 
              display: 'flex',
              
              }}>
              <Button onClick={this.findTotalEmployee} variant={this.state.BtnVariantTotalEmployee}> 전체 </Button> 
              <Button onClick={this.findByProject} variant={this.state.BtnVariantProject}> 프로젝트 </Button> 
              <Button onClick={this.findByDepartment} variant={this.state.BtnVariantDepartment}> 부서 </Button> 
              <Button onClick={this.findByStaffLevel} variant={this.state.BtnVariantStaffLevel}> 직급 </Button><br/>
          </ButtonGroup>
        </div>
        <div>
          {this.findChartByBtn(this.state.clickedBtnName)}
        </div>
        <div>
          {
          /* 함수 실행
          -> 전체 조회 버튼 외 타 버튼이 클릭된 경우 여부 확인
            -> 전체 조회버튼일 경우 null 반환
            -> 타 버튼일 경우 테이블 반환 
          -> 차트 내 조각 클릭한 이벤트 기반으로 테이블 조회
            -> 차트 컴포넌트에서 클릭한 조각 정보 가져오기
            -> 클릭된 조각별로 데이터 조회
          */}
          
        </div>


      </div>
    );
  }
}