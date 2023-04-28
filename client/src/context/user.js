import {React, useState} from 'react';

const UserContext = React.createContext();

let UserProvider = ({children}) => {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value = {{user, setUser}}>
            {children}
        </UserContext.Provider>
        )
}

export {UserContext, UserProvider};