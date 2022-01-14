export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.accessToken) {
      console.log(user.roles[0]);
      return { Authorization: 'Bearer ' + user.accessToken 
    , role : user.roles[0]};
    } else {
      return {};
    }
  }