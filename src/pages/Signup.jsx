import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';
const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async(e)=>{
    if(e?.preventDefault()){
        e.preventDefault()
    }
    try{
      
        const res = await axios.post(`${BASE_URL}/user/signup`, { formData }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });


        const { token } = res.data;
    
        localStorage.setItem('token', token);
      
        if (res.status === 201) {
            navigate('/profileedit');
        }
    }
    catch(error){
        console.log(error)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Sign Up</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">UserName</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash size={18} /> : <IoEyeOutline size={20} />}
              </span>
            </div>
          </div>

          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold transition duration-200"
          onClick={handleSubmit}>
            Sign Up
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
