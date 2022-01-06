import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TopBar from './TopBar';
import TopMenu from './TopMenu';
function handleClick(e) {
  e.preventDefault();
  console.log('The link was clicked.');
}
function Home() {
  return (
    <>
      <TopBar/>
      <TopMenu/>
    </>
  );
}

export default Home;
