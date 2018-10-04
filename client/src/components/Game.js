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
            if(this.state.wrongAnswers.length > 1){
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
        alert("GAME OVER\nScore successfully uploaded")
        this.setState({
            wrongAnswers:[],
            correctAnswers: []
        })
    }

    render(){
        return (
            <div className="App">
                <p className='title'>Try your best at finding the correct state. After 3 wrong answers it's game over!</p>
                <p className='title'>Find the following:</p>
                <p className='randomState'>{this.state.randomState}</p>
                <p className='score'>Current Score: {this.state.correctAnswers.length}</p>
                <p className='wrongAns'>Wrong Answers: {this.state.wrongAnswers.length}</p>
                <p className='msg'>{this.state.message}</p>
                <div className='map'>
                    <USAMap onClick={this.mapHandler} />
                </div>        
            </div>
        )
    }
}

export default Game