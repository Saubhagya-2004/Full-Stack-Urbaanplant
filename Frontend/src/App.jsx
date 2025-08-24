import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Body from './pages/body';
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/signup';
import Addplant from './pages/addplant';
import Updateplant from './pages/updateplant';
import Profile from './pages/profile';
import Plants from './pages/plants';

const App = () => {
  return (

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/' element={<Home />} />   
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='addplant' element={<Addplant />} />
            <Route path='updateplant/:id' element={<Updateplant />} /> 
            <Route path='profile' element={<Profile />} />
            <Route path='plants' element={<Plants />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;
