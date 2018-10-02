import React, { Component } from "react";
import Form from "../shared/Form";
import FormsPage from "./FormsPage";

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      formToggle: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      formToggle: !prevState.formToggle
    }));
  };

  render() {
    return (
      <div className="auth-page">
        {/* {this.state.formToggle ? (
          <div>
            <span style={{ backgroundColor: "cornflowerblue" }}>Login</span>
            <span>Sign Up</span>
          </div>
        ) : (
          <div>
            <span>Login</span>
            <span style={{ backgroundColor: "cornflowerblue" }}>Sign Up</span>
          </div>
        )} */}




        {/* {!this.state.formToggle ? (
          <span onClick={this.toggle}>-Already a Member?</span>
        ) : (
          <span onClick={this.toggle}>-New Member?</span>
        )} */}




        {!this.state.formToggle ? (
          <Form
            inputs={{ username: "", password: "" }}
            submit={inputs => this.props.signUp(inputs)}
            render={props => <FormsPage {...props} btnText="Sign Up" altBtn="Have an account?" toggle={this.toggle }/>}
            reset
          />
        ) : (
          <Form
            inputs={{ username: "", password: "" }}
            submit={inputs => this.props.login(inputs)}
            render={props => <FormsPage {...props} btnText="Login" altBtn="New Member?" toggle={this.toggle } />}
            reset
          />
        )}
      </div>
    );
  }
}

export default Auth;
