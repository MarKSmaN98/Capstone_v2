import {useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
function Account ({logStatus, setLog, isWaiting}) {
    console.log('initial status check', logStatus)


    let logoutHandler = () => {
        fetch('/logout', {method: 'DELETE'})
            .then(r => {})
            .then(() => {
                console.log('logout handler called')
                setLog(false)
            })
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

    let dispChange = logStatus? loggedinDisp() : loggedoutDisp()

    console.log('at return', logStatus)
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