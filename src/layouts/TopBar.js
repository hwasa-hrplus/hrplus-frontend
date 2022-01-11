import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TopBar = () => {
    return (
        <Navbar className='topBar' variant='dark'>
            <Container>
                <Navbar.Brand className='topBar logo'><Link to='/employee/profile'>POSCO ICT</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">Mark Otto</a>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopBar;