import Nav from 'react-bootstrap/Nav'
import '../App.css'
import {Link} from 'react-router-dom'
import { UserContext } from '../context/user'
import { useContext } from 'react'

function Navbar () {
    const {user} = useContext(UserContext)

    return (
        <nav className='navbar navbar-dark-grey text-center'>
            <Link to='/' >Home</Link>
            <Link to='/products'>Products</Link>
            <img src='../images/logo.png' />
            <Link to='/cart'>Cart</Link>
            <Link to='/account'>{user? 'Account' : 'Log In'}</Link>
        </nav>
    )
}

export default Navbar