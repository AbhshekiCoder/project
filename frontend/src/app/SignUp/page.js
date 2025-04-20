import React from 'react'
import '../../css/common.css'
// import SignInBackground from '../../assets/SignInBackground.jpg'
export default function SignUp() {
    
  	return (
		<div className='' style={{backgroundColor:"#ffeee3"}}>
  	  	<div className='SignIn-SignUp-main'>
  	  	    <div className='SignIn-SignUp-inner-main rounded-md bg-gray-100 border-2 border-orange-600' style={{}}>
				<div className='text-center text-orange-600 font-semibold'>
					<h1 className='SignIn-SignUp-text'>SignUp</h1>
				</div>

				<div className='pl-12 pr-12 mt-10'>
					<form action="">
					{/* Email_ID */}
					<div className='pl-1 text-xl font-serif text-orange-600 '>
						<h1>Email Id</h1>
					</div>
					<div className='mt-2'>
						<input type="email" name='email' required className='SignUp-Common-Inputs rounded-sm w-full border-2 border-orange-400 focus:border-orange-300 h-9 pl-2 text-md focus:outline-none ' placeholder='👤 Enter email id' />
					</div>

					{/* Password */}
					<div className='pl-1 text-xl mt-6 font-serif text-orange-600'>
						<h1>Password</h1>
					</div>
					<div className='mt-2'>
						<input type="text" name='Password' required className='SignUp-Common-Inputs border-orange-400 focus:border-orange-300 border-2 rounded-sm w-full h-9 pl-2 text-md focus:outline-none ' placeholder='🔑 Enter Password' />
					</div>


					{/* Role */}
					<div className='flex mt-7'>
						{/* Employee role */}
						<div className='w-1/2'>
							<div className='pl-1.5 text-xl font-serif text-orange-600'>
								<h1>Role</h1>
							</div>
							<div className='mt-3'>
								{/* role */}
								<select name='role' required className='cursor-pointer SignUp-Common-Inputs focus:border-orange-300 border-orange-400 text-orange-700 border-2 rounded-md pl-2 pr-6 py-1.5'>
									<option className=' text-gray-700' value = "Salesman">Salesman</option>
									<option className="text-gray-700"value = "Accountant">Accountant</option>
								</select>
							</div>
						</div>
						{/* Distributor role Select */}
						<div className='w-1/2 pl-8'> 
							<div className='pl-1.5 text-xl font-serif text-orange-600'>
								<h1>Distributor</h1>
							</div>
							<div className='mt-3'>
								{/* distributor */}
								<select name='distributor' required className='SignUp-Common-Inputs cursor-pointer outline-none focus:border-orange-300 text-orange-700 border-orange-400 border-2 rounded-md pl-2 pr-9 py-1.5'>
									<option className=' text-gray-700' value="Mario">Mario</option>
									<option className=' text-gray-700' value="Tops">Tops</option>
									<option className=' text-gray-700' value="Balaji">Balaji</option>
									<option className="text-gray-700"value="Goodrick">Goodrick</option>
								</select>
							</div>
						</div>



					</div>

					{/* Submit */}
					<div className='text-2xl font-semibold flex justify-center mt-20 '>
						<button type='submit' className='SignUp-Common-Buttons cursor-pointer rounded-md  w-full border-2 text-gray-100 hover:text-orange-600 bg-orange-500 active:bg-orange-400 active:border-gray-200 active:text-gray-100 hover:bg-gray-200 hover:border-orange-500  border-orange-700' style={{height:'44px'}}>SignUp</button>
					</div>
					</form>
				</div>
  	  	    </div>
  	  	</div>
			</div>
  	)
}