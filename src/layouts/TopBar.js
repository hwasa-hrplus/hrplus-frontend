import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
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
                <Navbar.Brand ><Link className='topBar logo style' to='/employee/profile'>POSCO ICT</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {user?(<a className="greet">{user.korName} 님, 반갑습니다!&nbsp;&nbsp;</a>):(<></>)}
                </Navbar.Text>
                
                <Button id="logoutBtn" href="/login" onClick={logOut} variant="light"><FontAwesomeIcon icon={faSignOutAlt}/>&nbsp;로그아웃</Button>
                </Navbar.Collapse>

                
            </Container>
        </Navbar>
    );
};

export default TopBar;