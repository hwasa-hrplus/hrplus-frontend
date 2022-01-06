import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Styles from './Styles';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
    <Styles />    
    <App />
  </BrowserRouter>,  
  document.getElementById('root')
);