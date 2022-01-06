import React from 'react';
import { Route, Routes } from "react-router-dom";
import Header from './layouts/Header';
import EmployeeRouter from './routers/EmployeeRouter';
import AdminRouter from './routers/AdminRouter';
import BizTripRouter from './routers/BizTripRouter';

function App() {
  return (
    <div> 
      <Header/>
      <Routes>
        <Route path="/employee/*" element={<EmployeeRouter />} />
        <Route path="/bizTrip/*" element={<BizTripRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </div>
  );
}

export default App;
