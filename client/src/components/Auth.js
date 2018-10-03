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
    const { status, err } = this.props.authErr;
    console.log(status);
    let errMsg = "";
    if (status < 500 && status > 399) {
      errMsg = err;
    } else if (status > 499) {
      errMsg = err;
    }

  

    return (
      <div className="auth-page">
        {!this.state.formToggle ? (
          <Form
            inputs={{ username: "", password: "" }}
            submit={inputs => this.props.signUp(inputs)}
            render={props => (
              <FormsPage
                {...props}
                btnText="Sign Up"
                altBtn="Have an account?"
                toggle={this.toggle}
                errMsg={errMsg}
              />
            )}
            reset
          />
        ) : (
          <Form
            inputs={{ username: "", password: "" }}
            submit={inputs => this.props.login(inputs)}
            render={props => (
              <FormsPage
                {...props}
                btnText="Login"
                altBtn="New Member?"
                toggle={this.toggle}
                errMsg={errMsg}
              />
            )}
            reset
          />
        )}
              </div>
    );
  }
}

export default Auth;
