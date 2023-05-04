import { UserContext } from "../context/user"
import { useState, useContext, useEffect} from 'react'
import { Navigate } from "react-router-dom"
function Homepage () {

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

    return (
        <div className="WelcomePage" >
            <h1>{user? `Welcome, ${user.name}` : 'Welcome Guest!'}</h1>
        </div>
    )
}

export default Homepage