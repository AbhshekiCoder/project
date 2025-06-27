"use client"
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userinfo } from '../feature/userinfo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.name.value);
  const cart = useSelector((state) => state.cart.value);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(userinfo(''));
    router.push('./');
  };

  return (
    <nav className="bg-[#5D8736] h-16 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <div className="text-white text-2xl font-bold tracking-wide">
          <span className="text-[#F4FFC3]">VyaparMitra</span>
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.role === 'salesMan' && (
              <button 
                onClick={() => router.push('./Cart')}
                className="relative p-2 text-[#F4FFC3] hover:text-white transition"
              >
                <FaShoppingCart className="text-xl" />
                {cart > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F4FFC3] text-[#5D8736] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center space-x-2 text-[#F4FFC3]">
              <FaUser className="text-lg" />
              <span className="font-medium hidden sm:inline">Hi, {user.name}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-[#809D3C] text-white font-medium px-4 py-2 rounded-md hover:bg-[#A9C46C] transition"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="./"
              className="flex items-center space-x-2 bg-[#809D3C] text-white font-medium px-4 py-2 rounded-md hover:bg-[#A9C46C] transition"
            >
              <FaSignInAlt />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
            
            <Link
              href="./SignUp"
              className="flex items-center space-x-2 bg-[#F4FFC3] text-[#5D8736] font-medium px-4 py-2 rounded-md hover:bg-[#D4E8A0] transition"
            >
              <FaUserPlus />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}