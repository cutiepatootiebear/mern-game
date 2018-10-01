import React from 'react'

const Scores = props => {
    return (
        <div>
            {props.scores.map(score => <h2>{score}</h2>)}
        </div>
    )
}

export default Scores