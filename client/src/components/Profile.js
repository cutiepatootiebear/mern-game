import React from 'react'
import '../app.css'

const Profile = props => {
    const { authenticated, logout } = props
    return (
        <div className='profile'>
            <h1>Hello {props.user.username}!</h1>
            <h1 className="navstyle">Scores{props.scores.map(obj => <h3 className="score-num">{obj.score}</h3>)}</h1>
            {authenticated && <button onClick={logout} className='logout-button'>Logout</button>}
        </div>
    )
}

export default Profile