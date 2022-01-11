import React from 'react';
import { Route, Switch} from "react-router-dom";
import Header from './layouts/Header';
import EmployeeRouter from './routers/EmployeeRouter';
import AdminRouter from './routers/AdminRouter';
import BizTripRouter from './routers/BizTripRouter';

function App() {
  return (
    <div> 
      <Header/>
      <Switch>
        <Route path="/employee/*" component={EmployeeRouter} />
        <Route path="/bizTrip/*" component={BizTripRouter} />
        <Route path="/admin/*" component={AdminRouter} />
      </Switch>
    </div>
  );
}

export default App;
