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
		<> 
         <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      
    </div>
		<div className='message w-fit h-6 mb-6  m-auto   '>
        <Message type = "success" id = "message" className='h-9 m-auto flex justify-center items-center text-green-500'>hello</Message>

        </div>
		
  	  	<div className='SignIn-main '>
			
  	  	    <div className='SignIn-inner-main border-gray-700 border-2 rounded-sm'>
				<form className='signup' name="signup" onSubmit={signup}>
				<div className='text-center '>
					<h5 className='SignIn-text'>SignUp</h5>
				</div>

				<div className='pl-12 pr-12 mt-16 '>
					{/* Email_ID */}
					<div className=' text-xl  font-inter'>
						<h5>Name</h5>
					</div>
					<div className='mt-2'>
						<input type="text" className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter your name' name = "name" required/>
					</div>
					<div className=' text-xl  font-inter'>
						<h5>Phone</h5>
					</div>
					<div className='mt-2'>
						<input type="Number" className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter your phone no' name = "phone" required/>
					</div>
					<div className=' text-xl  font-inter'>
						<h5>Email Id</h5>
					</div>
					<div className='mt-2'>
						<input type="text" className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter email id' name = "email" required/>
					</div>

					{/* Password */}
					<div className=' text-xl mt-6'>
						<h5>Password</h5>
					</div>
					<div className='mt-2'>
						<input type="password" required className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='🔑 Enter Password' name ="password"/>
					</div>

					{/* Role */}
					<div className='flex mt-7'>
						{/* Employee role */}
						<div className='w-1/2'>
							<div className=' text-xl '>
								<h5>Select Employee Role</h5>
							</div>
							<div className='mt-3'>
								<select className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5' name='role' required>
									<option className=' text-gray-700' value="SalesMan">Salesman</option>
									<option className="text-gray-700"value="Accountant">Accountant</option>
								</select>
							</div>
						</div>
						{/* Distributor role  */}
						<div className='w-1/2 pl-3.5'>
							<div className=' text-xl '>
								<h5>Select Distributor</h5>
							</div>
							<div className='mt-3'>
								<select className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5' name="distributorship">
									<option className=' text-gray-700' value="Mario">Mario</option>
									<option className=' text-gray-700' value="Tops">Tops</option>
									<option className=' text-gray-700' value="Balaji">Balaji</option>
									<option className="text-gray-700"value="Goodrick">Goodrick</option>
								</select>
							</div>
						</div>



					</div>

					{/* Submit */}
					<div className='text-3xl font-medium flex justify-center mt-16 '>
						<button type='submit' className='cursor-pointer rounded-md h-12 w-72 border-2 text-gray-700 bg-emerald-200 border-gray-600'>SignIn</button>
					</div>
					</div>
				</form>
			
  	  	    </div>
  	  	</div>
		</>
  	)
}