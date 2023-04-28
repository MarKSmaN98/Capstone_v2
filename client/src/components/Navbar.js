import Nav from 'react-bootstrap/Nav'
import '../App.css'
import {Link} from 'react-router-dom'

function Navbar () {

    return (
        <nav className='navbar navbar-dark-grey text-center'>
            <a href='/'>Home</a>
            <a href='/products'>Products</a>
            <img src='../images/logo.png' />
            <a href='/cart'>Cart</a>
            <a href='/account'>Account</a>
        </nav>
    )
}

export default Navbar