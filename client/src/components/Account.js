import {useContext, useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/user'
function Account () {
    const {user, setUser} = useContext(UserContext)
    const [showEdit, setShowEdit] = useState(false)

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

    if (user) {
        document.title=`${user.name}'s Account`
    }


    let logoutHandler = () => {
        fetch('/logout', {method: 'DELETE'})
            .then(r => {
                if (r.ok) {
                    setUser(null)
                }
            })
    }

    let handleEdit = (e) => {   
        e.preventDefault()
        if (e.target.name.value == '') {e.target.name.value = user.name}
        if (e.target.username.value == '') {e.target.username.value = user.username}
        if (e.target.email.value == '') {e.target.email.value = user.email}
        if (e.target.age.value == '') {e.target.age.value = user.age}
        fetch(`/users/${user.id}`, {
                method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': e.target.name.value,
                'username': e.target.username.value,
                'email': e.target.email.value,
                'age': e.target.age.value
            })
        }).then(r => {
            if (r.ok) {
                return r.json()
            }
            else {
                alert('something went wrong!')
            }
        }).then(body => {
            if (body) {
                setUser(body)
                e.target.reset()
            }
        })
        setShowEdit(!showEdit)
    }

    let delAccount = () => {
        fetch(`/users/${user.id}`, {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                setUser(null)
            }
            else {
                alert('something went wrong')
            }
        })
    }
    
    let loggedinDisp = () => {
        return (
            <>
                Logged in!
                <br></br>
                <button onClick={() => {logoutHandler()}}>Log Out</button>
                <div className='acountInfo'>
                    <h2 hidden={showEdit}>Name: {user.name}</h2>
                    <h2 hidden={showEdit}>Username: {user.username}</h2>
                    <h2 hidden={showEdit}>Email: {user.email}</h2>
                    <h2 hidden={showEdit}>Account Type: {user.account_type == 0? 'User' : 'Seller'}</h2>
                    <h2 hidden={showEdit}>Age: {user.age}</h2>
                    <button hidden={showEdit} onClick={() => setShowEdit(!showEdit)}>Edit</button>
                    <form onSubmit={handleEdit}>
                    <h2 hidden={!showEdit}>Name: <input name='name' placeholder={user.name}></input></h2>
                    <h2 hidden={!showEdit}>Username: <input name='username' placeholder={user.username}></input></h2>
                    <h2 hidden={!showEdit}>Email: <input name='email' placeholder={user.email}></input></h2>
                    <h2 hidden={!showEdit}>Age: <input name='age' placeholder={user.age}></input></h2>
                    <h2 hidden={!showEdit}>Change Password: <input name='password'></input></h2>
                    <button hidden={!showEdit}>Submit</button>
                    <button hidden={!showEdit} onClick={delAccount}>Delete Account</button>
                    </form>
                </div>
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