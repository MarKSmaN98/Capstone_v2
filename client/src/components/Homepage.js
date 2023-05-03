import { UserContext } from "../context/user"
import { useState, useContext, useEffect} from 'react'
import { Navigate } from "react-router-dom"
function Homepage () {

    const {user} = useContext(UserContext)
    if (!user) {
        return (<Navigate replace to='/' toHome={true}/>) 
    }

    return (
        <h1>{user? `Welcome ${user.name}` : 'Welcome Guest!'}</h1>
    )
}

export default Homepage