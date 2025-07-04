"use client"
import React, { useReducer, useState } from 'react';
import LINK from 'next/link';
import { Message } from 'rsuite';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {userinfo}  from '../../feature/userinfo';
import url from '@/misc/url';
export default function SignIn() {
  let dispatch = useDispatch()
  let router = useRouter()
  let [type, setType] = useState("success")
  let [message, setMessage] = useState()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    let result = await axios.post(`${url}signin/signin`, formData)
    if(!result.data.success){
      setType("warning")
      setMessage(result.data.message)
      document.querySelector(".message").style.display = "block"
      setTimeout(() =>{
        document.querySelector('.message').style.display = "none"
  
      },2000)
  
    }
    else{
      console.log(result.data.data)
      dispatch(userinfo(result.data.data))
      setType("success")

      setMessage(result.data.message)

      document.querySelector(".message").style.display = "block"
      localStorage.setItem("token", result.data.token)
      
      
      if(result.data.role == "salesMan"){
        router.push("./Salesman")
      }
      if(result.data.role == "Accountant"){
        router.push("./Accountant")
      }
      
      
    }
      
    
    
  };

  return (
    <div className="min-h-screen bg-[#F4FFC3] flex items-center justify-center px-4">
       <div className='w-fit h-fit modal message'>
	<Message showIcon type = {type} className="w-fit m-auto">
         {message}
	</Message>

	</div>
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[#5D8736] mb-6 text-center">Sign In to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#5D8736] text-white py-2 rounded-lg font-semibold hover:bg-[#809D3C] transition"
          >
            Sign In
          </button>
        </form>

        {/* Link to Signup */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <LINK href="./SignUp" className="bg-[#5D8736] font-semibold hover:underline">
            Sign up here
          </LINK>
        </p>
      </div>
    </div>
  );
}
