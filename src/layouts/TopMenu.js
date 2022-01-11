import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TopMenu = () => {
    return (
      <>
       <Nav  className="justify-content-center" variant="pills" >
          <Nav.Item>
          <Nav.Link as={Link} to="/employee/profile" eventKey="link-1">인사</Nav.Link>
          </Nav.Item>   
          <Nav.Item>
            <Nav.Link as={Link} to="/bizTrip/bizTripDetail" eventKey="link-2">출장</Nav.Link>
          </Nav.Item>       
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/list" eventKey="link-3">Admin</Nav.Link>
          </Nav.Item>
        </Nav>
      </>
    );
};

export default TopMenu;