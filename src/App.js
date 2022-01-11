<<<<<<< HEAD
import Bar from "./layouts/Bar";
import Menu from "./layouts/Menu";

function App() {
  return (
    <div className="App">
      <Bar/>
      <Menu/>
=======
import React from 'react';
import { Route, Routes } from "react-router-dom";
import Header from './layouts/Header';
import EmployeeRouter from './routers/EmployeeRouter';
import AdminRouter from './routers/AdminRouter';
import BizTripRouter from './routers/BizTripRouter';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <div> 

      <Header/>
      <Routes>
      <Route path="/employee/*" element={<LoginForm />} />
        {/* <Route path="/employee/*" element={<EmployeeRouter />} /> */}
        <Route path="/bizTrip/*" element={<BizTripRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
>>>>>>> origin/development
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/development
