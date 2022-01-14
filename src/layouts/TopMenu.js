import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';

const TopMenu = () => {
    const user = authService.getCurrentUser();
    let showAdminBoard;
    if(user){
      showAdminBoard = user.roles.includes("ROLE_ADMIN");
    }    
    return (
      <>
        <Nav  className="justify-content-center" variant="pills"  defaultActiveKey="link-1">
          <Nav.Item>
          <Nav.Link as={Link} to="/employee/profile" eventKey="link-1" >인사</Nav.Link>
          </Nav.Item>   
          <Nav.Item>
            <Nav.Link as={Link} to="/bizTrip/bizTripDetail" eventKey="link-2" activeStyle={{color: "red"}}>출장</Nav.Link>
          </Nav.Item>       
          {showAdminBoard && (<Nav.Item>
            <Nav.Link as={Link} to="/admin/list" eventKey="link-3">Admin</Nav.Link>
          </Nav.Item>)}
        </Nav>
      </>
    );
};

export default TopMenu;