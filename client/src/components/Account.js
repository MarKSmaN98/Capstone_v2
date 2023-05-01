import {useContext} from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/user'
function Account () {
    const {user, setUser} = useContext(UserContext)
    fetch('http://localhost:5555/check').then(r => r.json()).then(body => console.log(body))

    if (user !== null) {
        document.title=`${user.name}'s Account`
    }


    let logoutHandler = () => {
        fetch('/logout', {method: 'DELETE'})
            .then(r => {})
            .then(() => {
                setUser(null)
            })
        console.log('logout')
    }
    
    let loggedinDisp = () => {
        return (
            <>
                Logged in!
                <br></br>
                <button onClick={() => {logoutHandler()}}>Log Out</button>
            </>
        )
    }

    let loggedoutDisp = () => {
        return (
            <div>
                <br></br>
                How did you get in here?
                <br></br>
                <br></br>
                401: Not Authorized!
                <Navigate replace to='/login' />
            </div>
        )
    }

    let dispChange = user? loggedinDisp() : loggedoutDisp()

    return (
        <div>
            Account
            <br></br>
            {
                dispChange
            }
        </div>
    )

}

export default Account