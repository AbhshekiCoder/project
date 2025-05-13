"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Message } from 'rsuite'
import { useRouter } from 'next/navigation'
let url = process.env.URL




// import SignInBackground from '../../assets/SignInBackground.jpg'


export default function SignUp() {
	let router = useRouter()
  let [type, setType] = useState("success")
  let [message, setMessage] = useState()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'salesMan',
    distributorship: 'Balaji',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
 

  const handleSubmit = async(e) => {
    e.preventDefault();

	let result = await axios.post("http:///localhost:5000/signup/signup", formData)
    if(!result.data.success){
		setType("warning")
		setMessage(result.data.message)
		document.querySelector(".message").style.display = "block"
		setTimeout(() =>{
			document.querySelector('.message').style.display = "none"

		},2000)

	}
	else{
		setType("success")
		setMessage(result.data.message)
		document.querySelector(".message").style.display = "block"
		setTimeout(() =>{
			document.querySelector('.message').style.display = "none"

		},2000)
		router.push('./')
	}
    
  };

  return (
	<> 
	
    <div className="min-h-screen bg-[#E8F5E9] grid items-center justify-center px-4">
    <div className='w-fit h-fit modal message'>
	<Message showIcon type = {type} className="w-fit m-auto">
         {message}
	</Message>

	</div>
	
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[#2E7D32] mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
              placeholder="Enter your name"
            />
          </div>

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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
              placeholder="9876543210"
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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
            >
              <option value="salesMan">salesMan</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>

          {/* Distributorship */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Distributorship Name</label>
			<select
              name="distributorship"
              value={formData.distributorship}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
            >
              <option value="Balaji">Balaji</option>
              <option value="Namkeen">Namkeen</option>
			  <option value="Colgate">Colgate</option>
			  <option value="Coachlate">Coachlate</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#2E7D32] text-white py-2 rounded-lg font-semibold hover:bg-[#1B5E20] transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
	</>
  );
}
