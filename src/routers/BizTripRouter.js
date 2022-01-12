import { faSuitcase, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Nav } from 'react-bootstrap';
import { Link, Route, Switch } from 'react-router-dom';
import BizTripDetail from '../components/BizTripDetail';
import RegistBizTrip from '../components/RegistBizTrip';

const BizTripRouter = () => {
    return (
        <div className='sideMenuContent'>            
           <div className="sideMenu">
            <Nav className="d-md-block side" defaultActiveKey="link-1">
                <Nav.Item>
                    <Nav.Link className="sideItem" as={Link} to="bizTripDetail" eventKey="link-1"><FontAwesomeIcon icon={faSuitcase}/>&nbsp;&nbsp;&nbsp;출장 조회</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="sideItem" as={Link} to="registBizTrip" eventKey="link-2"><FontAwesomeIcon icon={faUserEdit}/>&nbsp;&nbsp;출장 신청</Nav.Link>
                </Nav.Item> 
            </Nav>   
            </div>
            <div className="content">
                <Switch>
                    <Route path="/biztrip/registBizTrip" component={RegistBizTrip} />
                    <Route path="/biztrip/bizTripDetail" component={BizTripDetail} />
                </Switch>
            </div>
        </div>
    );
};

export default BizTripRouter;
