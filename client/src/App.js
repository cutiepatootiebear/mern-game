import React from "react";
import Navbar from "./components/Navbar";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import ProtectedRoute from "./shared/ProtectedRoute";
import Game from "./components/Game"
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Scores from "./components/Scores";
// import Footer from "./components/Footer";
import axios from "axios";

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
        let { user } = res.data;
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
    // console.log(this.state.scores)
    // console.log(this.state.authErr.status)
    const { isAuthenticated, loading } = this.state;
    return (
      <div>
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
                  <Redirect to="/game" />
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
              path="/profile"
              redirectTo="/"
              isAuthenticated={isAuthenticated}
              render={props => <Profile {...props} user={this.state.user} />}
            />
            <ProtectedRoute
              path="/scores"
              redirectTo="/"
              isAuthenticated={isAuthenticated}
              render={props => <Scores {...props} scores={this.state.scores} />}
            />
            <ProtectedRoute
              path="/game"
              redirectTo="/"
              isAuthenticated={isAuthenticated}
              render={props => <Game />}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default withRouter(App);
