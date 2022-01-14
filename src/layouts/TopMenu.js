import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import React, { useRef, useState } from "react";


const TopMenu = () => {
    const [currentTab, setCurrentTabHrmasterTap] = useState(1);
  
    const setPage = () => {
      if(sessionStorage.currentTab) {
          setCurrentTabHrmasterTap(Number(sessionStorage.currentTab));
          console.log('Number(sessionStorage.currentTab): ', Number(sessionStorage.currentTab));
          return Number(sessionStorage.currentTab);
      }
      this.setState({ currentTab : 1 })
      return 1;
    }

    const useComponentWillMount = (func) => {
      const willMount = useRef(true)
  
      if (willMount.current) func()
        willMount.current = false
    }
  
    useComponentWillMount(() => {
      setPage();
    })
  
    
     
    const onClickEvent = (event) => {
      let tapName = event.target.text;
      switch(tapName){
        case "인사":
          sessionStorage.setItem('currentTab', 1);
          break;

        case "출장":
          sessionStorage.setItem('currentTab', 2);
          break;
        
        case "Admin":
          sessionStorage.setItem('currentTab', 3);
          break;
        
        default:
          return ""
      }
    }

    const user = authService.getCurrentUser();
    let showAdminBoard;
    if(user){
      showAdminBoard = user.roles.includes("ROLE_ADMIN");
    } 
    
    console.log('currentTab before return: ', currentTab);
    

    return (
      <>
        <Nav  className="justify-content-center" variant="pills"  defaultActiveKey="link-1">
          <Nav.Item>
          <Nav.Link as={Link} to="/employee/profile" eventKey="link-1" className={currentTab === 1 ? "nav-link active" : "nav-link inactive"} onClick={(e)=>{onClickEvent(e)}}>인사</Nav.Link>
          </Nav.Item>   
          <Nav.Item>
            <Nav.Link as={Link} to="/bizTrip/bizTripDetail" className={currentTab === 2 ? "nav-link active" : "nav-link inactive"} eventKey="link-2" onClick={(e)=>{onClickEvent(e)}}>출장</Nav.Link>
          </Nav.Item>       
            {showAdminBoard && (<Nav.Item>
              <Nav.Link as={Link} to="/admin/list" className={currentTab === 3 ? "nav-link active" : "nav-link inactive"} eventKey="link-3" onClick={(e)=>{onClickEvent(e)}}>Admin</Nav.Link>
            </Nav.Item>)}
        </Nav>
        {/* className="nav-link active" */}
      </>
    );
};

export default TopMenu;