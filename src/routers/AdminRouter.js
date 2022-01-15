import { faFileSignature, faIdCard, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, Route, Switch } from 'react-router-dom';
import HrInfoList from '../components/admin/HrInfoList';
import RegistEmployee from '../components/admin/RegistEmployee';
import EmployeeDetail from '../components/admin/EmployeeDetail';
import ApproveBizTrip from '../components/admin/ApproveBizTrip';

const AdminRouter = () => {
    return (
        <div className='sideMenuContent'>            
           <div className="sideMenu">
            <Nav className="d-md-block side" defaultActiveKey="link-1">
                <Nav.Item>
                <Nav.Link className="sideItem" as={Link} to="/admin/list" eventKey="link-1"><FontAwesomeIcon icon={faIdCard}/>&nbsp;&nbsp;&nbsp;인사 정보 조회</Nav.Link>
                </Nav.Item>   
                <Nav.Item>
                    <Nav.Link className="sideItem" as={Link} to="/admin/regist" eventKey="link-2"><FontAwesomeIcon icon={faUserPlus}/>&nbsp;&nbsp;&nbsp;인사 정보 추가</Nav.Link>
                </Nav.Item>    
                <Nav.Item>
                <Nav.Link className="sideItem" as={Link} to="/admin/approve" eventKey="link-3"><FontAwesomeIcon icon={faFileSignature}/>&nbsp;&nbsp;&nbsp;출장 승인</Nav.Link>
                </Nav.Item>
            </Nav>   
            </div>
            <div className="content">
                <Switch>
                    <Route path="/admin/list" component={HrInfoList} />
                    <Route path='/admin/detail/:id' component={EmployeeDetail} />                
                    <Route path="/admin/regist" component={RegistEmployee} />
                    <Route path="/admin/approve" component={ApproveBizTrip} />
                </Switch>
            </div>
        </div>
    );
};

export default AdminRouter;
