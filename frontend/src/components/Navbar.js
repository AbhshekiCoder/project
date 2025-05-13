"use client"
import React, { useReducer } from 'react'
import Image from 'next/image'
import LINK from "next/link";
import CompanyLogo from '../assets/CompanyLogo.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { userinfo } from '../feature/userinfo';


export default function Navbar() {
	let dispatch = useDispatch()
	let user = useSelector((state) => state.name.value)
     let logout = () =>{
		localStorage.removeItem('token');
		dispatch(userinfo(''))

	 }
  	return (

		<nav className="bg-green-400 h-[70px] px-8 flex items-center justify-between shadow-xl sticky-top">
		{/* Logo */}
		<div className="text-white text-2xl font-bold tracking-wide">
		  <span className="text-[#A5D6A7]"><LINK href = "/">Green</LINK></span>Zone
		</div>
  
		{/* Buttons */}
		<div className="flex space-x-4">
			{user?<><div className='flex items-center text-white font-bold'>Hii {user.name}</div> <button
		
			className="bg-[#A5D6A7] text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#A5D6A7] hover:scale-105 transition duration-300 max-md:px-2 max-md:py-1 max-sm:w-36  "
			style={{backgroundColor: "#A5D6A7"}}
			onClick={logout}
		  >
			Logout
		  </button></>:<>
		  <LINK
			href="./"
			className="bg-[#A5D6A7] text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#A5D6A7] hover:scale-105 transition duration-300"
			style={{backgroundColor: "#A5D6A7"}}
		  >
			Sign In
		  </LINK>
		  <LINK
			href="./SignUp"
			className="bg-[rgb(94 148 0)] text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#2E7D32] hover:scale-105 transition duration-300"
			style={{backgroundColor: "rgb(94 148 0)"}}
		  >
			Sign Up
		  </LINK>
		  </>}
		
		</div>
	  </nav>
  	)
}
