import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, Route, Switch } from 'react-router-dom';
import HrInfo from '../components/hrMaster/HrInfo';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";

const EmployeeRouter = () => {
    return (
        <div className='sideMenuContent'>            
           <div className="sideMenu">
            <Nav className="d-md-block side" defaultActiveKey="link-1">
                <Nav.Item>
                <Nav.Link className="sideItem" as={Link} to="profile" eventKey="link-1"> <FontAwesomeIcon icon={faIdBadge}/>&nbsp;&nbsp;&nbsp;인사 정보</Nav.Link>
                </Nav.Item>   
            </Nav>   
            </div>
            <div className="content">
                <Switch>
                    <Route path="/employee/hrinfo" component={HrInfo}/>
                </Switch>
            </div>
        </div>
    );
};

export default EmployeeRouter;