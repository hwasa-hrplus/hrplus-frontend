import axios from 'axios';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authHeader from '../services/auth-header';
import authService from '../services/auth.service';
import React, { useEffect, useRef, useState } from "react";


const TopMenu = () => {
    const [currentTab, setCurrentTab] = useState(1);
  
    const setPage = () => {
      if(sessionStorage.currentTab) {
        setCurrentTab(Number(sessionStorage.currentTab));
        console.log('Number(sessionStorage.currentTab): ', Number(sessionStorage.currentTab));
        return Number(sessionStorage.currentTab);
      }
      setCurrentTab(Number(sessionStorage.currentTab));
      return 1;
    }

    useEffect(()=>{
      console.log('새로고침 확인!');
      setPage();
    });
     
    const onClickEvent = (event) => {
      let tapName = event.target.text;
      switch(tapName){
        case "인사":
          console.log('인사 클릭 후 TapName: ', tapName);
          sessionStorage.setItem('currentTab', 1);
          setCurrentTab(1);
          console.log('인사 클릭 후 currentTap: ', currentTab);
          
          break;

        case "출장":
          console.log('출장 클릭 후 TapName: ', tapName);
          sessionStorage.setItem('currentTab', 2);
          setCurrentTab(2);
          console.log('출장 클릭 후 currentTap: ', currentTab);
          break;
        
        case "Admin":
          console.log('Admin 클릭 후 TapName: ', tapName);
          sessionStorage.setItem('currentTab', 3);
          setCurrentTab(3);
          console.log('Admin 클릭 후 currentTap: ', currentTab);
          break;
        
        default:
          return ""
      }
    }

    const user = authService.getCurrentUser();
    let showAdminBoard;
    if(user){
      showAdminBoard = user.roles.includes("ROLE_ADMIN");
    }    

    //테스트 위한 코드
    const API_URL = "/api/v1/auth/test/";
    const handleClick = () =>{
      axios.get(API_URL+"admin", { headers: authHeader() })
      .then( (response)=>console.log(response.data));      
    }


    return (
      <>
      {/*  defaultActiveKey={"link-"+String(currentTab)} */}
        <Nav  className="justify-content-center" variant="pills" >          
          <Nav.Item>
          <Nav.Link as={Link} to="/employee/profile" eventKey="link-1" className={currentTab === 1 ? "nav-link active" : "nav-link inactive"} 
          onClick={(e)=>{onClickEvent(e)}}>인사</Nav.Link>
          </Nav.Item>   
          <Nav.Item>
            <Nav.Link as={Link} to="/bizTrip/bizTripDetail" className={currentTab === 2 ? "nav-link active" : "nav-link inactive"} eventKey="link-2" 
            onClick={(e)=>{onClickEvent(e)}}>출장</Nav.Link>
          </Nav.Item>       
          {showAdminBoard && (<Nav.Item>
            <Nav.Link as={Link} to="/admin/list" className={currentTab === 3 ? "nav-link active" : "nav-link inactive"} eventKey="link-3" 
            onClick={(e)=>{onClickEvent(e)}}>Admin</Nav.Link>
          </Nav.Item>)}          
          {/* <button onClick={handleClick}>테스트</button>           */}
        </Nav>
        {/* className="nav-link active" */}
      </>
    );
};

export default TopMenu;