import React from 'react'
import '../../css/common.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';


export default function SignIn() {
  	return (
		<div className='' style={{backgroundColor:"#ffeee3"}}>
  	  	<div className='SignIn-SignUp-main'>
  	  	    <div className='SignIn-SignUp-inner-main rounded-md bg-white border-2 border-orange-600' style={{}}>
				<div className='text-center text-orange-600 font-semibold'>
					<h1 className='SignIn-SignUp-text '>SignIn</h1>
				</div>

				<div className='pl-12 pr-12 mt-10'>
					<form action="">
					{/* Email_ID */}
					<div className='pl-1 flex text-xl text-orange-600 '>
						<h1 className='font-inter'>Email Id</h1>
						<h1 className='font--outfit'>Email Id</h1>
						<h1 className='font--rubik'>Email Id</h1>
						<h1 className='font--poppins'>Email Id</h1>
					</div>
					<div className='mt-2 '>
						<input type="email" name='email' required className='SignUp-Common-Inputs rounded-sm w-full border-2 border-orange-400 focus:border-orange-300 h-9 pl-1.5 text-md focus:outline-none focus:border-2' placeholder='👤 Enter email id' />
					</div>

					{/* Password */}
					<div className='pl-1 text-xl mt-6 font-serif text-orange-600'>
						<h1>Password</h1>
					</div>
					<div className='mt-2'>
						<input type="text" name='Password' required className='SignUp-Common-Inputs border-orange-400 focus:border-orange-300 border-2 rounded-sm w-full  h-9 pl-1.5 text-md focus:outline-none' placeholder='🔑 Enter Password' />
					</div>

					{/* Role */}
					<div className='mt-7 '>
						{/* Employee role */}
							<div className='pl-1.5 text-xl font-serif text-orange-600'>
								<h1>Role</h1>
							</div>
							<div className='mt-2 '>
								{/* role */}
								<select name='role' required className='SignUp-Common-Inputs cursor-pointer focus:border-orange-300 border-orange-400 text-orange-700 border-2 rounded-md pl-2 pr-6 py-1.5'>
									<option className='text-gray-700 ' value = "Salesman">Salesman</option>
									<option className="text-gray-700 "value = "Accountant">Accountant</option>
								</select>
							</div>
					</div>

					<div className='flex justify-center mt-12'>
						<h1 className='w-fit cursor-pointer font-semibold text-gray-600'><u className='cursor-pointer'>LogIn</u> With Your Organisation</h1>
					</div>

					{/* Submit */}
					<div className='text-2xl font-semibold flex justify-center mt-4 '>
						<button type='submit' className='SignUp-Common-Buttons cursor-pointer rounded-md  w-full border-2 text-gray-100 hover:text-orange-600 bg-orange-500 active:bg-orange-400 active:border-gray-200 active:text-gray-100 hover:bg-gray-200 hover:border-orange-500  border-orange-700' style={{height:'44px'}}>SignIn</button>
					</div>
					</form>
				</div>
  	  	    </div>
  	  	</div>
			</div>
  	)
}
