import { faIdCard, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import RegistEmployee from '../components/RegistEmployee';
import Detail from '../components/Detail'
const AdminRouter = () => {
    return (
        <div className='sideMenuContent'>            
           <div className="sideMenu">
            <Nav className="d-md-block side" defaultActiveKey="link-1">
                <Nav.Item>
                <Nav.Link className="sideItem" as={Link} to="list" eventKey="link-1"><FontAwesomeIcon icon={faIdCard}/>&nbsp;&nbsp;&nbsp;인사 정보 조회</Nav.Link>
                </Nav.Item>   
                <Nav.Item>
                    <Nav.Link className="sideItem" as={Link} to="regist" eventKey="link-2"><FontAwesomeIcon icon={faUserPlus}/>&nbsp;&nbsp;&nbsp;인사 정보 추가</Nav.Link>
                </Nav.Item>    
            </Nav>   
            </div>
            <div className="content">
           
                <Routes>
                    <Route path="/list" element={<EmployeeList />} />
                    <Route path='/detail/:id' element={<Detail/>} />

                </Routes>
                <Routes>
                    <Route path="regist" element={<RegistEmployee />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminRouter;