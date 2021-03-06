import React, { Fragment } from "react";
import Navbar from "./components/Navbar";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import ProtectedRoute from "./shared/ProtectedRoute";
import Game from "./components/Game";
import Globe from "./globe/pages/index";
import Auth from "./components/Auth";
import axios from "axios";
import Particles from "react-particles-js";

let postsAxios = axios.create();

postsAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      scores: [],
      user: {
        username: "",
        isAdmin: false
      },
      authErr: {
        status: "",
        err: ""
      },
      isAuthenticated: false,
      loading: false
    };
  }

  componentDidMount() {
    this.verify();
  }

  getData = () => {
    postsAxios.get("/api/scores").then(res => {
      this.setState({
        scores: res.data
      });
    });
  };

  signUp = userInfo => {
    axios
      .post("/auth/signup", userInfo)
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        this.authenticate(user);
      })
      .catch(err => {
        this.authErr(err.response.status, err.response.data.err);
      });
  };

  login = userInfo => {
    axios
      .post("/auth/login", userInfo)
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        this.authenticate(user);
      })
      .catch(err => {
        this.authErr(err.response.status, err.response.data.err);
      });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState(
      {
        user: {
          username: "",
          isAdmin: false
        },
        isAuthenticated: false,
        loading: false
      },
      () => {
        this.props.history.push("/");
      }
    );
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  authenticate = user => {
    this.setState(
      prevState => ({
        user: {
          ...user
        },
        isAuthenticated: true,
        loading: false
      }),
      () => {
        this.getData();
      }
    );
  };

  verify = () => {
    postsAxios
      .get("/api/profile")
      .then(res => {
        const { user } = res.data;
        this.authenticate(user);
      })
      .catch(err => {
        console.log(err);
      });
  };

  authErr = (status, err) => {
    this.setState(prevState => ({
      ...prevState,
      authErr: {
        status: status,
        err: err
      },
      loading: false
    }));
  };

  render() {
    const { isAuthenticated, loading } = this.state;
    return (
      <div className="style">
        {/* start particles */}
        <div className="particles">
          <Particles
            params={{
              particles: {
                number: {
                  value: 150,
                  density: {
                    enable: false
                  }
                },
                size: {
                  value: 3,
                  random: true
                },
                opacity: {
                  value: 0.48927153781200905,
                  random: false,
                  anim: {
                    enable: true,
                    speed: 0.2,
                    opacity_min: 0
                  }
                },
                line_linked: {
                  // enable: false
                },
                modes: {
                  bubble: {
                    distance: 50,
                    duration: 0,
                    size: 0,
                    opacity: 0
                  },
                  repulse: {
                    distance: 0,
                    duration: 0
                  }
                }
              }
            }}
          />
        </div>
        {/* end particles */}
        {isAuthenticated && (
          <Navbar logout={this.logout} authenticated={this.authenticate} />
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                isAuthenticated ? (
                  <Redirect to="/cities" />
                ) : (
                  <Auth
                    {...props}
                    signUp={this.signUp}
                    login={this.login}
                    authErr={this.state.authErr}
                  />
                )
              }
            />
            <ProtectedRoute
              path="/states"
              redirectTo="/"
              isAuthenticated={isAuthenticated}
              render={props => <Game {...props} scores={this.state.scores} />}
            />
            <ProtectedRoute
              path="/cities"
              redirectTo="/"
              isAuthenticated={isAuthenticated}
              render={props => <Globe {...props} scores={this.state.scores} />}
            />
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default withRouter(App);
