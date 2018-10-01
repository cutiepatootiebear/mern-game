import React from 'react'
import Navbar from './components/Navbar'
import { Switch, Route } from 'react-router-dom'
import Auth from './components/Auth'
import Profile from './components/Profile'
import Scores from './components/Scores'
import Footer from './components/Footer'
import './app.css'
import axios from 'axios'

let postsAxios = axios.create()
       
postsAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


class App extends React.Component {
    constructor(){
        super()
        this.state = {
            scores: [],
            user: {
                username: '',
                isAdmin: false
            },
            isAuthenticated: false
        }
    }

    authenticate = user => {
        this.setState(prevState => ({
            user: {
                ...user
            },
            isAuthenticated: true
        }), () => {
            this.getData()
        })
    }

    getData = () => {
        postsAxios.get("/api/scores").then(res => {
            this.setState({
                scores: res.data
            })
        })
    }

    signUp = userInfo => {
        axios.post("/auth/signup", userInfo).then(res => {
            const { token, user } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.toStringify(user))
            this.authenticate(user)
        }).catch(err => {
            console.log(err)
        })
    }

    login = userInfo => {
        axios.post("/auth/login", userInfo).then(res => {
            const { token, user } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.toStringify(user))
            this.authenticate(user)
        }).catch(err => {
            console.log(err)
        })
    }

    logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        this.setState({
            user: {
                username: '',
                isAdmin: false
            },
            isAuthenticated: false,
            posts: []
        }, () => {
            this.props.history.push('/')
        })
    }

    render(){
        return(
            <div>
                <Navbar logout={this.logout} authenticate={this.authenticate}/>
                <Switch>
                    <Route exact path="/" render={ props => <Auth {...props} signUp={this.signUp} login={this.login} />} />
                    <Route path="/profile" render={ props => <Profile {...props} user={this.state.user} />} />
                    <Route path="/scores" render={ props => <Scores {...props} scores={this.state.scores}/>} />
                </Switch>
                <Footer />
            </div>
        )
    }

}

export default App