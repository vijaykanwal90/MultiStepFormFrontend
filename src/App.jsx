// import { useState } from 'react'

import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileEdit from "./pages/ProfileEdit"
import SignUp from "./pages/Signup"
import Profile from "./pages/Profile"
function App() {


  return (
    <>
      <div className=''>
        <BrowserRouter>
        <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
          <Route path="/profileedit" element={<ProfileEdit/>} />
          
          <Route path="/" element={<Login/>} />

        </Routes>
        </BrowserRouter>
        {/* <Login/> */}
      </div>
    </>
  )
}

export default App
