import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = props => {
    const { authenticated, logout } = props
    return (
        <div className='navbar'>
            {/* <Link to="/profile">Profile</Link> */}
            <Link to="/game">Game</Link>
            <Link to="/globe">Globe</Link>
            {authenticated && <button onClick={logout} className='logout-button'>Logout</button>}
        </div>
    )
}

export default Navbar