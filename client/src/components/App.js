//Mark Coats Capstone Project 03/25/2023
import {React, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Cart from './Cart';
import Homepage from './Homepage';
import Navbar from './Navbar';
import Products from './Products';
import Account from './Account'
import Login from './Login'
import '../App.css';
import { UserProvider } from '../context/user';
import CheckUser from './CheckUser';
import SellerPage from './SellerPage';
//setIsLogged={setIsLogged}
function App() {
  document.title = "Mark's Site";
  const [isLogged, setIsLogged] = useState(null)
  // if (!isLogged) {
  //   return (<Navigate replace to='/checkuser' />)
  // }

  return (
      <div className="App">
        <UserProvider>
        <Navbar />
          <Routes>
            <Route 
              element={< SellerPage/>}
              path='/seller'
              />
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
                element={< Account />}
                path='/account'
                />
            <Route 
              element={< Login />}
              path='/login'
              />
          </Routes>
        </UserProvider>
        
        
      </div>
  )
  
}

export default App;
