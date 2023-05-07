import {useState, useContext} from 'react'
import {Navigate} from 'react-router-dom'
import { UserContext } from '../context/user';
function Login () {
    const [changeForm, setchangeForm] = useState(true); //true = login, false = signup
    const {user, setUser} = useContext(UserContext)

    let handleSubmitLogin = (e) => {
        e.preventDefault();
        let username = e.target.username.value;
        let password = e.target.password.value;
        fetch('/backlogin', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username':username,
                'password':password
            })
        })
        .then(r => {
            e.target.password.value = '';
            if (r.ok) {
                console.log('login r.ok', r.ok)
            }
            return r.json()
        })
        .then(rbody => {
            if (rbody) {
                console.log(rbody)
                if(rbody.name) {
                    setUser(rbody)
                }
            }
        })
    }

    let handleSubmitSignup = (e) => {
        e.preventDefault();
        let name= e.target.name.value;
        let age= e.target.age.value;
        let username= e.target.username.value;
        let email= e.target.email.value;
        let password= e.target.password.value;
        let accountType = e.target.accountType.value;
        fetch('/users', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'name': name,
                'age': age,
                'username': username,
                'email': email,
                'password': password,
                'type': accountType
            })
        }).then(r => {
            if (r.ok) {return r.json()}
            else {alert('something went wrong')}
        }).then(body => {
            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'name': 'Default Cart',
                    'user_id': body.id
                })
            }).then(r => r.json()).then(body => {
                if (body) {
                    user.carts.push(body)
                }
            })
        })
        setchangeForm(!changeForm);
    }

    let loginForm = () => {
        return (
            <div className="formContainer">
                <form onSubmit={handleSubmitLogin}>
                    <h2>Username or Email:</h2>
                    <input id='userInput' name='username' required/>
                    <br></br>
                    <h2>Password</h2>
                    <input type='password' name='password' required/>
                    <br></br>
                    <br></br>
                    <br></br>
                    <button id='loginSubmit' type='submit'>Log In</button>
                    <p>Forgot your password?</p>
                </form>
                <div id='signup'>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p>Don't have an account? Sign up!</p>
                    <button onClick={() => {setchangeForm(!changeForm)}} id='signupbtn'>Sign Up</button>
                </div>
            </div>
        )
    }

    let signupForm = () => {
        return (
            <div className='signupForm'>
                <form onSubmit={handleSubmitSignup}>
                    <h1>Get Experience Ready To Experience Experience A Whole New Experience Shopping Experience! </h1>
                    <h2>Name</h2>
                    <input type='text' name='name' required/>
                    <h2>Age</h2>
                    <input type='text' name='age' required/>
                    <h2>Username</h2>
                    <input type='text' name='username' required/>
                    <h2>Email</h2>
                    <input type='email' name='email' required/>
                    <h2>Password</h2>
                    <input name='password' type='password' required/>
                    <h2>Account Type</h2>
                    <select name='accountType'>
                        <option value='0'>Shopper</option>
                        <option value='1'>Seller</option>
                    </select>
                    <button type='submit'>Create Account</button>

                </form>
                <div>
                    <p>Have an account? Sign in!</p>
                    <button onClick={() => {setchangeForm(!changeForm)}} id='signinbtn'>Sign In</button>
                </div>
            </div>
        )
    }

    return (
        <div className='loginMain'>
            <div>
                <h1>Login Or Signup</h1>
            </div>
            <br></br>
            {changeForm? loginForm() : signupForm()}
            {user? <Navigate replace to='/account'/> : null}
        </div>
    )

}

export default Login