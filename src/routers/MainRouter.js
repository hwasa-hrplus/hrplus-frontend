import { Redirect, Route, Switch } from "react-router-dom";
import authService from "../services/auth.service";
import HomeRouter from "./HomeRouter";
import Login from "../components/LoginForm";

const MainRouter = () => { 
    const user = authService.getCurrentUser(); 
    let currLocation = window.location.href;
    currLocation = currLocation.split('http://localhost:3000')[1];

    if(user){ //로그인 유저가 있을 때
      if(currLocation==='/'|| // 루트 디렉토리나 어드민이 아닌데 어드민 접근하면
      (currLocation.includes("/admin")&&user.roles.includes("ROLE_USER"))) currLocation = '/employee/profile' //employee profile 페이지로
    } else { //없을 때
      currLocation = '/login'
    }
    return (      
      <div>
        <Redirect to={currLocation}/>
                
        <Switch>
          <Route path={["/employee", "/biztrip", "/admin"]} component={HomeRouter} />
          <Route exact path="/login" component={Login} />      
        </Switch>
      </div>
    );
  };
  export default MainRouter;