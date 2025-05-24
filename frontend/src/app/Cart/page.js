"use client"
import Navbar from '@/components/Navbar';
import { userinfo } from '@/feature/userinfo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartinfo } from '../../feature/cart';
import url from '@/misc/url';
import { X } from 'lucide-react';
import { io } from 'socket.io-client';
import Link from 'next/link';

export default function Cart() {
  const socket = io("https://project-aec1.onrender.com");
  const user = useSelector((state) => state.name.value);
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on('connect', () => console.log('Connected to server:', socket.id));
    socket.on('connect_error', (err) => console.error('Connection error:', err.message));
    
    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(`${url}cart_fetch/${token}`);
      if (result.data.success) {
        setCartItems(result.data.data.map(item => ({
          ...item,
          customerName: '',
          customerId: '',
          date: new Date().toISOString().split('T')[0] // Set default date to today
        })));
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerChange = (productId, field, value) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSellAllProducts = async () => {
    try {
      setIsLoading(true);
      const isValid = cartItems.every(item => 
        item.customerName && item.customerId && item.date
      );
      
      if (!isValid) {
        alert("Please fill all customer details for all products");
        return;
      }

      const productsData = cartItems.map(product => ({
        product_name: product.name,
        price: product.price,
        product_id: product.product_id,
        user_id: user.email,
        customerId: product.customerId,
        date: product.date,
        quantity: product.quantity,
        customerName: product.customerName,
        time: new Date().toLocaleTimeString(),
        distributor: user.distributorship,
        salesMan: user.name,
        CGST: product.CGST,
        SGST: product.SGST,
        HSN: product.HSN
      }));

      const result = await axios.post(`${url}sales/sales`, { products: productsData });
      
      if (result.data.success) {
        alert("All products sold successfully");
        localStorage.removeItem("cart");
        dispatch(cartinfo(0));
        socket.emit('send_message', {
          author: user.name,
          message: `New products sold: ${productsData.map(item => item.product_name).join(', ')}`,
          time: new Date().toLocaleTimeString()
        });
        fetchCartData();
      }
    } catch (error) {
      console.error("Error selling products:", error);
      alert("Error selling products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`${url}cart/delete/${id}`);
      if (result.data.success) {
        setCartItems(prev => prev.filter(item => item._id !== id));
        dispatch(cartinfo(cartItems.length - 1));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("./SignIn");
        return;
      }
      try {
        const result = await axios.post(`${url}/user/user`, { token });
        if (result.data.success) {
          dispatch(userinfo(result.data.data));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    fetchCartData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4FFC3] px-4 py-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="./Salesman" className="inline-flex items-center text-[#5D8736] hover:text-[#809D3C] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D8736]"></div>
            </div>
          ) : (
            <>
              {cartItems.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#5D8736]">Your Cart ({cartItems.length} items)</h1>
                    <button
                      onClick={handleSellAllProducts}
                      className="bg-[#5D8736] hover:bg-[#809D3C] text-white font-semibold py-2 px-6 rounded-md shadow transition flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Sell All Products'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cartItems.map((item) => (
                      <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#A9C46C] hover:shadow-lg transition">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-[#5D8736]">{item.name}</h3>
                            <button 
                              onClick={() => handleDelete(item._id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <X size={20} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                            <div>
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium ml-1">₹{item.price}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Qty:</span>
                              <span className="font-medium ml-1">{item.quantity}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">CGST:</span>
                              <span className="font-medium ml-1">{item.CGST}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">SGST:</span>
                              <span className="font-medium ml-1">{item.SGST}%</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                              <input
                                type="text"
                                value={item.customerName}
                                onChange={(e) => handleCustomerChange(item._id, 'customerName', e.target.value)}
                                className="w-full px-3 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5D8736]"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                              <input
                                type="text"
                                value={item.customerId}
                                onChange={(e) => handleCustomerChange(item._id, 'customerId', e.target.value)}
                                className="w-full px-3 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5D8736]"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleCustomerChange(item._id, 'date', e.target.value)}
                                className="w-full px-3 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5D8736]"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-[#5D8736] mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-4">Add some products from the catalog</p>
                  <Link 
                    href="./Salesman" 
                    className="inline-block bg-[#5D8736] hover:bg-[#809D3C] text-white font-medium py-2 px-6 rounded-md transition"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}