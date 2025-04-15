import React from 'react'
import '../../css/common.css'
// import SignInBackground from '../../assets/SignInBackground.jpg'
export default function SignUp() {
    
  	return (
  	  	<div className='SignIn-SignUp-main'>
  	  	    <div className='SignIn-SignUp-inner-main border-gray-700 border-2 rounded-sm'>
				<div className='text-center '>
					<h1 className='SignIn-SignUp-text'>SignUp</h1>
				</div>

				<div className='pl-12 pr-12 mt-16 '>
					<form action="">
					{/* Email_ID */}
					<div className='text-xl font-inter'>
						<h1>Email Id</h1>
					</div>
					<div className='mt-2'>
						<input type="email" name='email' required className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter email id' />
					</div>

					{/* Password */}
					<div className=' text-xl mt-6'>
						<h1>Password</h1>
					</div>
					<div className='mt-2'>
						<input type="text" name='Password' required className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='🔑 Enter Password' />
					</div>

					{/* Role */}
					<div className='flex mt-7'>
						{/* Employee role */}
						<div className='w-1/2'>
							<div className=' text-xl '>
								<h1>Select Employee Role</h1>
							</div>
							<div className='mt-3'>
								{/* role */}
								<select name='role' required className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5'>
									<option className=' text-gray-700' value = "Salesman">Salesman</option>
									<option className="text-gray-700"value = "Accountant">Accountant</option>
								</select>
							</div>
						</div>
						{/* Distributor role Select */}
						<div className='w-1/2 pl-3.5'> 
							<div className=' text-xl '>
								<h1>Select Distributor</h1>
							</div>
							<div className='mt-3'>
								{/* distributor */}
								<select name='distributor' required className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5'>
									<option className=' text-gray-700' value="Mario">Mario</option>
									<option className=' text-gray-700' value="Tops">Tops</option>
									<option className=' text-gray-700' value="Balaji">Balaji</option>
									<option className="text-gray-700"value="Goodrick">Goodrick</option>
								</select>
							</div>
						</div>



					</div>

					{/* Submit */}
					<div className='text-3xl font-medium flex justify-center mt-20 '>
						<button type='submit' className='cursor-pointer rounded-md h-12 w-72 border-2 text-gray-700 bg-emerald-200 border-gray-600'>SignUp</button>
					</div>
					</form>
				</div>
  	  	    </div>
  	  	</div>
  	)
}