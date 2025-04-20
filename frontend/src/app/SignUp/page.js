"use client"
import React, { useState } from 'react'
import '../../css/common.css'
import axios from 'axios'
import { Message } from 'rsuite'



// import SignInBackground from '../../assets/SignInBackground.jpg'
export default function SignUp() {
	let [type, setType] = useState();

         let signup = async(e) =>{
			e.preventDefault()

			let form = document.forms['signup'];
			let name = form.name.value;
			let email = form.email.value;
			let password = form.password.value;
			let phone = form.phone.value;
			let role = form.role.value;
		    let distributorship = form.distributorship.value;

			let obj = {
				name,
				email,
				password,
				phone,
				role,
				distributorship
			}
			let result = await axios.post("http://localhost:5000/signup/signup", obj);
			if(result.data.success){
				setType("success")
				document.getElementById('message').innerText = result.data.message;
				document.querySelector('.message').style.display = "block";
				setTimeout(() =>{
					document.getElementById('message').style.display = "none";

				},2000)
				
			}
			else{
				setType("warning")
				document.getElementById('message').innerText = result.data.message;
				document.querySelector('.message').style.display = "block";
				setTimeout(() =>{
					document.getElementById('message').style.display = "none";

				},2000)
			}

		 }
    
  	return (
  	  	<div className='SignIn-main '>
  	  	    <div className='SignIn-inner-main border-gray-700 border-2 rounded-sm'>
				<div className='text-center '>
					<h1 className='SignIn-text'>SignUp</h1>
				</div>

				<div className='pl-12 pr-12 mt-16 '>
					<form action="">
					{/* Email_ID */}
					<div className=' text-xl  font-inter'>
						<h1>Email Id</h1>
					</div>
					<div className='mt-2'>
						<input type="text" className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter email id' />
					</div>

					{/* Password */}
					<div className=' text-xl mt-6'>
						<h5>Password</h5>
					</div>
					<div className='mt-2'>
						<input type="text" required className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='🔑 Enter Password' />
					</div>

					{/* Role */}
					<div className='flex mt-7'>
						{/* Employee role */}
						<div className='w-1/2'>
							<div className=' text-xl '>
								<h5>Select Employee Role</h5>
							</div>
							<div className='mt-3'>
								<select className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5'>
									<option className=' text-gray-700' value="Accountant">Salesman</option>
									<option className="text-gray-700"value="Accountant">Accountant</option>
								</select>
							</div>
						</div>
						{/* Distributor role Select */}
						<div className='w-1/2 pl-3.5'> 
							<div className=' text-xl '>
								<h5>Select Distributor</h5>
							</div>
							<div className='mt-3'>
								<select className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5'>
									<option className=' text-gray-700' value="Accountant">Mario</option>
									<option className=' text-gray-700' value="Accountant">Tops</option>
									<option className=' text-gray-700' value="Accountant">Balaji</option>
									<option className="text-gray-700"value="Accountant">Goodrick</option>
								</select>
							</div>
						</div>



					</div>

					{/* Submit */}
					<div className='text-3xl font-medium flex justify-center mt-20 '>
						<button className='cursor-pointer rounded-md h-12 w-72 border-2 text-gray-700 bg-emerald-200 border-gray-600'>SignIn</button>
					</div>
				</div>
  	  	    </div>
  	  	</div>
		</>
  	)
}