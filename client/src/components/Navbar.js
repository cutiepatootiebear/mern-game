import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = props => {
    const { authenticated, logout } = props
    return (
        <div>
            <Link to="/">Scores</Link>
            <Link to="/profile"></Link>
            {authenticated && <button onClick={logout}>Logout</button>}
        </div>
    )
}

export default Navbar