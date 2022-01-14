import axios from "axios";

const API_URL = "/api/v1/auth/sign/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, password, role, id, korName) { 
    id *= 1;
    console.log(role);
    const data = {username, password, role, id, korName};
    return axios.post(API_URL + "signup", data);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();