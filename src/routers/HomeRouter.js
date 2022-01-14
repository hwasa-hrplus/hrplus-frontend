import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminRouter from './AdminRouter';
import BizTripRouter from './BizTripRouter';
import EmployeeRouter from './EmployeeRouter';
import Header from '../layouts/Header';
import loginComponent from '../components/login.component';
import Copyright from '../layouts/Copyright';

const HomeRouter = () => {
    return (
        <div>
            <Header/>
            <Switch>
                <Route path="/employee" component={EmployeeRouter} />
                <Route path="/bizTrip" component={BizTripRouter} />
                <Route path="/admin" component={AdminRouter} />
            </Switch>
            <Copyright/>
        </div>
    );
};

export default HomeRouter;