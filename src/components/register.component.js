import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};


const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangeKorName = this.onChangeKorName.bind(this);
    this.state = {
      username: "",
      korName:"",
      password: "",
      role: ["admin"],
      successful: false,
      message: "",
      id:"",
    };
  }
  

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  onChangeRole(e) {
    this.setState({
      role: [e.target.value]
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }  

  onChangeId(e) {
    this.setState({
      id: e.target.value
    });
  }  
  onChangeKorName(e) {
    this.setState({
      korName: e.target.value
    });
  } 

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.password,
        this.state.role,
        this.state.id,
        this.state.korName
      ).then(
        
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          })
          this.props.history.push("/employee/profile");
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="id">사번</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="id"
                    value={this.state.id}
                    onChange={this.onChangeId}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="korName">한국이름</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="korName"
                    value={this.state.korName}
                    onChange={this.onChangeKorName}
                    validations={[required, vusername]}
                  />
                </div>
                

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="radio">
                  <label htmlFor="role">
                    <input
                      type="radio"
                      value="user"
                      checked={this.state.role[0] === "user"}
                      onChange={this.onChangeRole}
                    />
                    사원
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      value="admin"
                      checked={this.state.role[0] === "admin"}
                      onChange={this.onChangeRole}
                    />
                    결재자
                  </label>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}