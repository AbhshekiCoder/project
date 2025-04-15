import React from 'react'
import '../../css/common.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';


export default function SignIn() {
  return (
    <div className='SignIn-SignUp-main'>
        <div className='SignIn-SignUp-inner-main border-gray-700 border-2 rounded-sm'>
            {/* To add 50% transparency */}
            <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-50"></div>

            <div className='text-center font-stretch-condensed font-semibold'>
                <h1 className='SignIn-SignUp-text'>SignIn</h1>
            </div>

            <div className='pl-12 pr-12 mt-12'>
                <form action="">
                {/* Email_ID */}
                <div className=' text-xl font-inter'>
                    <h1>Email Id</h1>
                </div>
                
                <div className='mt-2'>
                    <input name='email' required type="email" className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='👤 Enter gmail id' />
                </div>

            {/* Password */}
                <div className=' text-xl mt-6'>
                    <h1>Password</h1>
                </div>
               
                <div className='mt-2'>
                    <input name='password' type="text" required className='rounded-sm w-full border h-9 pl-2 text-md' placeholder='🔑 Enter Password Key' />
                </div>

            {/* Role */}

                {/* Employee role */}
                <div className='mt-7'>
                    <div className=' text-xl '>
                        <h1>Select Employee Role</h1>
                    </div>
                    <div className='mt-3'>
                        <select name='role' className='cursor-pointer border-2 border-gray-500 rounded-md pl-2 pr-6 py-1.5'>
                            <option className=' text-gray-700' value="Salesman">Salesman</option>
                            <option className="text-gray-700"value="Accountant">Accountant</option>
                        </select>
                    </div>
                </div>

           

            {/* Submit */}
            <div className='text-3xl font-medium flex justify-center mt-16 '>
                <button type='submit' className='cursor-pointer rounded-md h-12 w-72 border-2 text-gray-700 bg-emerald-200 border-gray-600'>SignIn</button>
            </div>
            </form>
        </div>
    </div>
</div>
  )
}
