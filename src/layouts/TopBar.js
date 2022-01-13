import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';

const TopBar = () => {
    const user = authService.getCurrentUser();  
    const logOut = () => {
        authService.logout();        
    }
    return (
        <Navbar className='topBar' variant='dark'>
            <Container>
                <Navbar.Brand className='topBar logo style'><Link to='/employee/profile'>POSCO ICT</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {user?(<a>반갑습니다 {user.username}님!</a>):(<></>)}
                </Navbar.Text>
                
                <a href="/login" className="nav-link" onClick={logOut}>
                  로그아웃
                </a>
                </Navbar.Collapse>

                
            </Container>
        </Navbar>
    );
};

export default TopBar;