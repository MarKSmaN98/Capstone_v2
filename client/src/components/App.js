//Mark Coats Capstone Project 03/25/2023
import {React, useState, useRef, useEffect, createContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import Cart from './Cart';
import Homepage from './Homepage';
import Navbar from './Navbar';
import Products from './Products';
import Account from './Account'
import Login from './Login'
import '../App.css';
import { UserProvider } from '../context/user';

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isWaiting, setisWaiting] = useState(true);
  console.log('isWaiting', isWaiting);
  const logRef = useRef({});
  logRef.current=isLoggedIn;
  document.title = "Mark's Site";

  useEffect(() => {
    async function checkLogin() {
      await fetch('/check')
        .then( r => {
          if (r.ok){
            setisLoggedIn(true);
          }
          else {
            setisLoggedIn(false);
          }
        })
        .then(() => {
          setisWaiting(false)
        })
    }
    checkLogin();
  }, [isLoggedIn]);

  let loginHandler = (boo) => {
    setisLoggedIn(boo);
  }

  let appHandler = () => {
    return (
      <div className="App">
        {console.log('app login status', isLoggedIn)}
        <Navbar />
        <UserProvider>
          <Routes>
            <Route 
              element={< Homepage />}
              path='/'
              />
            <Route 
              element={< Products />}
              path='/products'
              />
            <Route 
              element={< Cart />}
              path='/cart'
              />
            <Route 
              element={< Account setLog={loginHandler} logStatus={isLoggedIn} wait={isWaiting} />}
              path='/account'
              />
            <Route 
              element={< Login setLog={loginHandler} logStatus={isLoggedIn} />}
              path='/login'
              />
          </Routes>
        </UserProvider>
        
        
      </div>
    );
  }
  return (
    <div>
      {
        isWaiting? <></> : appHandler()
      }
    </div>
  )
  
}

export default App;
