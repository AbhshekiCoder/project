"use client"
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { cartinfo } from '../../feature/cart';
import { userinfo } from '@/feature/userinfo';
import { useRouter } from 'next/navigation';
import url from '@/misc/url';
import { io } from 'socket.io-client';

export default function SalesmanPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.name.value);
  const cart = useSelector((state) => state.cart.value);
  const [product, setProduct] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 20;

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

    const socket = io(url)
useEffect(() => {
    // Initialize socket connection
    
   socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

 socket.on('receive_message', (data)=>{
 // alert(data.message);
 console.log(data)
    
    setMessages(prev => [...prev, data]);
    
    setNewMessage('');
   

 
  
 })
    

  
 

  return () => {
    socket.off('connect');
    socket.off('connect_error');
    socket.off('receive_message')

  }
  },[]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        sender: user?.name || 'Anonymous',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: "salesman_message"
      }
      
      socket.emit('send_message', messageData);
      
      //setMessages(prev => [...prev, messageData]);
      console.log(messages)
     // setNewMessage('');
      
    }
  };
  // Filtering Functions
  const filterByPrice = (product) => {
    if (priceFilter === 'below50') return product.price < 50;
    if (priceFilter === '50to100') return product.price >= 50 && product.price <= 100;
    if (priceFilter === 'above100') return product.price > 100;
    return true;
  };

  const filteredProducts = productsData
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter(filterByPrice);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSell = async (product, id) => {
    const quantity = document.getElementById(id).value;
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const token = localStorage.getItem("token");
    const obj = {
      name: product.name,
      price: product.price,
      quantity: quantity,
      user_id: token,
      product_id: product._id,
      CGST: product.CGST,
      SGST: product.SGST,
      HSN: product.HSN
    };

    try {
      const result = await axios.post(`${url}cart/cart`, obj);
      if (result.data.success) {
        alert(result.data.message);
        const result1 = await axios.get(`${url}cart_fetch/${token}`);
        if (result1.data.success) {
          dispatch(cartinfo(result1.data.data.length));
          localStorage.setItem("cart", result1.data.data.length);
         
        }
        localStorage.setItem(product._id, 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert("Failed to add product to cart");
    }
  };

  const fetch_data = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("./SignIn");
      return;
    }

    try {
      // Fetch user data
      const userResult = await axios.post(`${url}user/user`, { token });
      if (userResult.data.success) {
        dispatch(userinfo(userResult.data.data));
      }

      // Fetch cart data
      const cartResult = await axios.get(`${url}cart_fetch/${token}`);
      if (cartResult.data.success) {
        dispatch(cartinfo(cartResult.data.data.length));
        localStorage.setItem("cart", cartResult.data.data.length);
      }

      // Fetch products
      const productResult = await axios.get(`${url}product/product`);
      if (productResult.data.success) {
        setProduct(productResult.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

  useEffect(() => {
    fetch_data();
  }, [fetch_data]);

  useEffect(() => {
    if (user?.distributorship && product.length > 0) {
      const filtered = product.filter(product => product.distributor === user.distributorship);
      setProductsData(filtered);
    }
  }, [user, product]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4FFC3] px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header and Cart */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#5D8736]">Product Catalog</h1>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-[#A9C46C] p-2 rounded-lg transition"
              onClick={() => router.push("./Cart")}
            >
              <i className="fa-solid fa-cart-shopping text-xl text-[#5D8736]"></i>
              <span className="bg-[#5D8736] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {cart}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                <input
                  type="text"
                  placeholder="Enter product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D8736]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Price</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D8736]"
                >
                  <option value="all">All Prices</option>
                  <option value="below50">Below ₹50</option>
                  <option value="50to100">₹50 – ₹100</option>
                  <option value="above100">Above ₹100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D8736]"></div>
            </div>
          ) : (
            <>
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white border border-[#A9C46C] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-[#5D8736] mb-1 truncate">{product.name}</h3>
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Price:</span> ₹{product.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Stock:</span> {product.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Distributor:</span> {product.distributor}
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-[#A9C46C] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5D8736]"
                            placeholder="Enter quantity"
                            min={product.quantity < 1 ? 0 : 1}
                            max={product.quantity}
                            id={product._id}
                            required
                            onChange={(e) => {
                              if (e.target.value < 0) e.target.value = 0;
                              if (e.target.value > product.quantity) e.target.value = product.quantity;
                            }}
                          />
                        </div>

                        <button
                          onClick={() => handleSell(product, product._id)}
                          className="w-full bg-[#5D8736] text-white py-2 rounded-md hover:bg-[#809D3C] transition font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No products available matching your criteria</p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#A9C46C] text-[#5D8736] hover:bg-[#809D3C] hover:text-white'}`}
              >
                Previous
              </button>

              <span className="text-[#5D8736] font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#A9C46C] text-[#5D8736] hover:bg-[#809D3C] hover:text-white'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Chat Button */}
      <button 
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-[#5D8736] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#809D3C] transition-all z-50"
      >
        <i className={`fa-solid ${showChat ? 'fa-times' : 'fa-comment-dots'} text-xl`}></i>
      </button>

      {/* Chat Interface */}
      {showChat && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border border-[#A9C46C] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#5D8736] text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Support Chat</h3>
            <button 
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                Start a conversation with support
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${msg.sender === user?.name ? 'text-right' : 'text-left'}`}
                >
                  <div className={`inline-block p-2 rounded-lg ${msg.sender === user?.name ? 'bg-[#5D8736] text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.sender !== user?.name && (
                      <div className="text-xs font-semibold">{msg.sender}</div>
                    )}
                    <div>{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-[#A9C46C] rounded focus:outline-none focus:ring-1 focus:ring-[#5D8736]"
              />
              <button
                onClick={sendMessage}
                className="bg-[#5D8736] text-white px-3 rounded hover:bg-[#809D3C]"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}