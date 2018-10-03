import React from 'react'

const Scores = props => {
    return (
        <div className="scores">
            {props.scores.map(obj => <h2>{obj.score}</h2>)}
        </div>
    )
}

export default Scores