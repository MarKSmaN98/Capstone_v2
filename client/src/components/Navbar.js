import Nav from 'react-bootstrap/Nav'
import '../App.css'
import {Link} from 'react-router-dom'
import { UserContext } from '../context/user'
import { useContext, useEffect } from 'react'

function Navbar () {
    const {user, setUser} = useContext(UserContext)
    useEffect(() => {
        if (!user) {
            fetch('/check').then(r => {
                if (r.ok) {
                    return r.json();
                }
                else {
                    setUser({
                        'name': 'Guest',
                        'user_carts': [
                            {
                                'name': 'GuestCart',
                                'items': []
                            }
                        ]
                    });
                    console.log('welcome, guest');
                }
            })
            .then(body => {
                setUser(body);
            })
        }

    },[])

    if(!user) {
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

    return (
        <nav className='navbar navbar-dark-grey text-center'>
            <Link to='/' >Home</Link>
            <Link to='/products'>Products</Link>
            <img src='../images/logo.png' />
            {user.account_type == 1? <Link to='/seller'>{`${user.name}'s products`}</Link> : null}
            <Link to='/cart'>Cart</Link>
            <Link to='/account'>{user? 'Account' : 'Log In'}</Link>
        </nav>
    )
}

export default Navbar