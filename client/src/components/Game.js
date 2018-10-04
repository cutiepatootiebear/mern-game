import React from 'react'
import axios from 'axios'
import USAMap from 'react-usa-map'
import '../app.css'

let postsAxios = axios.create();

postsAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            correctAnswers: [],
            wrongAnswers: [],
            randomState: '',
            message: ''
        }
    }

    componentDidMount(){
        axios.get('/states').then(res => {
            let randomNum = Math.floor((Math.random() * 52) + 1)
            // console.log(res.data)
            this.setState({
                randomState: res.data[randomNum].abbreviation
            })
        })
    }

    randomState = () => {
        let randomNum = Math.floor((Math.random() * 51) + 1)
        axios.get('/states').then(res => {
            this.setState({
                randomState: res.data[randomNum].abbreviation
            })
        })
    }

    mapHandler = event => {
        if(event.target.dataset.name !== this.state.randomState){
            if(this.state.wrongAnswers.length > 3){
                const newScore = {
                    score: this.state.correctAnswers.length
                }
                postsAxios.post('/api/scores', newScore).then(res => {
                this.gameOver()
            })
            } else {
                this.setState(prevState => ({
                    wrongAnswers: [...prevState.wrongAnswers, "1"],
                    message: 'WRONG! Try again'
                }))
            }
        } else {
            this.setState(prevState => ({
                correctAnswers: [...prevState.correctAnswers, "1"],
                message: ''
            }))
            alert("Correct! Keep going!")
            this.randomState()
        }
        // alert(event.target.dataset.name)
    }

    gameOver = () => {
        alert("GAME OVER\n Score successfully uploaded")
        this.setState({
            wrongAnswers:[],
            correctAnswers: []
        })
    }

    render(){
        // console.log(`Wrong answers: ${this.state.wrongAnswers.length}`)
        // console.log(`Correct answers: ${this.state.correctAnswers.length}`)
        return (
            <div className="App">
                <h1>US States Game</h1>
                <p>Try your best at guessing at finding the correct state</p>
                <p>Find {this.state.randomState}</p>
                <p>{this.state.message}</p>
                <p>Current Score: {this.state.correctAnswers.length}</p>
                <p>Wrong Answers: {this.state.wrongAnswers.length}</p>
                <USAMap onClick={this.mapHandler} />        
            </div>
        )
    }
}

export default Game