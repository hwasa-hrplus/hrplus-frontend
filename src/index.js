import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
import App from './App';


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
=======
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Styles from './Styles';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
    <Styles />    
    <App />
  </BrowserRouter>,  
>>>>>>> origin/development
  document.getElementById('root')
);