import axios from 'axios';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authHeader from '../services/auth-header';
import authService from '../services/auth.service';

const TopMenu = () => {
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
        <Nav  className="justify-content-center" variant="pills"  defaultActiveKey="link-1">          
          <Nav.Item>
          <Nav.Link as={Link} to="/employee/profile" eventKey="link-1">인사</Nav.Link>
          </Nav.Item>   
          <Nav.Item>
            <Nav.Link as={Link} to="/bizTrip/bizTripDetail" eventKey="link-2">출장</Nav.Link>
          </Nav.Item>       
          {showAdminBoard && (<Nav.Item>
            <Nav.Link as={Link} to="/admin/list" eventKey="link-3">Admin</Nav.Link>
          </Nav.Item>)}          
          {/* <button onClick={handleClick}>테스트</button>           */}
        </Nav>
      </>
    );
};

export default TopMenu;