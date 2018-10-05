import React from 'react'
import axios from 'axios'
import USAMap from 'react-usa-map'
import '../app.css'
import { runInThisContext } from 'vm';

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
            scores: [],
            highScore: 0,
            randomState: '',
            message: ''
        }
    }

    componentDidMount(){
        this.getScores()
        // setTimeout(this.setHighScore, 200)
        axios.get('/states').then(res => {
            let randomNum = Math.floor((Math.random() * 52) + 1)
            this.setState({
                randomState: res.data[randomNum].abbreviation
            })
        })
    }

    getScores = () => {
        postsAxios.get("/api/scores").then(res => {
            const mappedData = res.data.map(obj => obj.score)
            this.setState(prevState => ({
                scores: [...prevState.scores, ...mappedData],
                highScore: Math.max(...[...prevState.scores, ...mappedData])
            }))
        });
    };

    // setHighScore = () => {
    //     console.log(this.state.scores)
    //       this.setState({
    //         highScore: Math.max(...this.state.scores)
    //       })
    // }

    // largestNum = scoresArr => {
    //     const num = scoresArr.reduce((prevLargest, currLargest) => {
    //         return (currLargest > prevLargest) ? currLargest : prevLargest
    //     }, 0)
    //     this.setState({
    //         highScore: num
    //     })
    // } 

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
        // console.log(this.state.scores)
        // console.log(Math.max.apply(Math, this.state.scores))
        // const { scores } = this.props;
        // console.log(scores)
        // console.log(this.state.highScore)
        return (
            <div>
                <p className='title'>Try your best at finding the correct state. After 3 wrong answers it's game over!</p>
                <p className='title'>Find the following:</p>
                <p className='randomState'>{this.state.randomState}</p>
                <div className='flexStuff'>
                    <p className='scoreText'>Your Highest Score:</p>
                    <p className='highScore'>{this.state.highScore}</p>
                    <p className='scoreText2'>Score:</p>
                    <p className='score'>{this.state.correctAnswers.length}</p>
                    <p className='scoreText2'>Incorrect:</p>
                    <p className='wrongAns'>{this.state.wrongAnswers.length}</p>
                </div>
                <p className='msg'>{this.state.message}</p>
                <div className='map'>
                    <USAMap onClick={this.mapHandler} />
                </div>        
            </div>
        )
    }
}

export default Game