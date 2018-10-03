import React from 'react'
import axios from 'axios'
import USAMap from 'react-usa-map'
import '../app.css'

class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            correctAnswers: [],
            wrongAnswers: [],
            randomState: ''
        }
    }

    componentDidMount(){
        axios.get('/states').then(res => {
            // console.log(res.data)
        })
    }

    randomState = () => {
        let randomNum = Math.floor((Math.random() * 52) + 1)
        axios.get('/states').then(res => {
            this.setState({
                randomState: res.data[randomNum].abbreviation
            })
        })
    }

    mapHandler = event => {
        if(event.target.dataset.name !== "MT"){
            this.setState(prevState => ({
                wrongAnswers: [...prevState.wrongAnswers, "1"]
            }))
            alert("You are incorrect. Try again.")  
        } else {
            this.setState(prevState => ({
                correctAnswers: [...prevState.correctAnswers, "1"]
            }))
            this.randomState()
            alert("Correct!")
        }
        // alert(event.target.dataset.name)
    }

    render(){
        console.log(`Wrong answers: ${this.state.wrongAnswers.length}`)
        console.log(`Correct answers: ${this.state.correctAnswers.length}`)
        return (
            <div className="App">
                <h1>US States Game</h1>
                <p>Try your best at guessing at finding the correct state</p>
                <p>Find {this.state.randomState}</p>
                <USAMap onClick={this.mapHandler} />        
            </div>
        )
    }
}

export default Game