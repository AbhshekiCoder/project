import React from 'react'
import Image from 'next/image'
import LINK from "next/link";
import CompanyLogo from '../assets/CompanyLogo.jpg'
export default function Navbar() {
  	return (
  	    <div className='fixed top-0 Navbar flex justify-between items-center' style={{boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",}}>
			<div className='Navbar-logo'>
				<Image src={CompanyLogo} className='h-full w-full rounded-xl' alt="" />
			</div>
			
			<div className='mr-20 flex gap-4 '>
				
          		<div className="mr-7 ml-4 ">
          		 	<button className="border-2 cursor-pointer font-semibold h-10 w-24 rounded-lg text-orange-800 hover:text-gray-100  hover:bg-orange-500 active:bg-orange-300 border-orange-600 hover:border-gray-400" style={{fontSize:"20px"}}><LINK href= "./SignUp">SignUp</LINK></button>
          		</div>
				<div >
            		<button className="cursor-pointer font-semibold h-10 w-24 rounded-lg text-orange-800 bg-orange-200 hover:bg-orange-400 hover:text-white active:bg-orange-300 border-2 border-orange-400 hover:border-gray-100" style={{fontSize:"20px",backgroundColor:""}}><LINK href= "./SignIn">SignIn</LINK></button>
          		</div>
			</div>
  	    </div>
  	)
}
