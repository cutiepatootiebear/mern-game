import React from 'react'
import USAMap from 'react-usa-map'
import '../app.css'

class Child extends React.Component {
    constructor(){
        super()
        this.state = {
            correctAnswers: [],
            wrongAnswers: []
        }
    }

    mapHandler = event => {
        if(event.target.dataset.name !== "MT"){
            this.setState(prevState => ({
                wrongAnswers: [...prevState.wrongAnswers, "1"]
            }))
            alert("You are incorrect. Try again.")  
        } else {
            console.log
            this.setState(prevState => ({
                correctAnswers: [...prevState.correctAnswers, "1"]
            }))
            alert("Correct!")
        }
        // alert(event.target.dataset.name)
    }

    render(){
        console.log(`Wrong answers: ${this.state.wrongAnswers.length}`)
        console.log(`Correct answers: ${this.state.correctAnswers.length}`)
        const { authenticated } = this.props
        return (
            <div className="App">
                <h1>US States Game</h1>
                <p>Try your best at guessing at finding the correct state</p>
                <USAMap onClick={this.mapHandler} />        
            </div>
        )
    }
}

export default Child