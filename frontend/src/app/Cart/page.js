"use client"
import Navbar from '@/components/Navbar';
import { userinfo } from '@/feature/userinfo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Cart() {
  let user = useSelector((state) => state.name.value)
  let dispatch = useDispatch()
  const url = "http://localhost:5000/";
  const [cartItems, setCartItems] = useState([])
  
  let data = async() =>{
    let token = localStorage.getItem("token")
    let result = await axios.get(`${url}cart_fetch/${token}`);
    console.log(result.data)
    if(result.data.success){
      setCartItems(result.data.data)
      console.log(result.data.data)
    }
  }

  const handleCustomerChange = (productId, field, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, [field]: value } : item
      )
    );
    console.log(cartItems)
  };

  const handleSellAllProducts = async() => {
    try {
      // Validate all required fields are filled
      const isValid = cartItems.every(item => 
        item.customerName && item.customerId && item.date
      );
      
      if (!isValid) {
        alert("Please fill all customer details for all products");
        return;
      }

      // Prepare all products data
      const productsData = cartItems.map(product => ({
        product_name: product.name,
        price: product.price,
        product_id: product.product_id,
        user_id: user.email,
        customerId: product.customerId,
        date: product.date,
        quantity: product.quantity,
        customerName: product.customerName,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
        distributor: user.distributorship,
        salesMan: user.name,
        CGST: product.CGST,
        SGST: product.SGST,
        HSN: product.HSN
       
        
      }));

      // Send all products at once (you might need to adjust your backend endpoint)
      let result = await axios.post("http://localhost:5000/sales/sales", {
        products: productsData
      });
      
      if(result.data.success){
        alert("All products sold successfully");
        // Refresh cart data
        data();
      }
    } catch (error) {
      console.error("Error selling products:", error);
      alert("Error selling products");
    }
  };

  useEffect(()=>{
    data()
    let fetch_data = async()=>{
      let token = localStorage.getItem("token");
      console.log(token)
      if(token){
        let result = await axios.post("https://project-aec1.onrender.com/user/user", {token: token});
        console.log(result.data)
        if(result.data.success){
          dispatch(userinfo(result.data.data));
          console.log(result.data.success)
        }
      }
      else{
        router.push("./SignIn")
      }
    }
    fetch_data()
  },[])

  return (
    <> 
    <Navbar/>
    <div className="min-h-screen bg-[#E8F5E9] px-4 py-6 sm:px-8">
      {/* Add the single Sell All button at the top */}
      {cartItems.length > 0 && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSellAllProducts}
            className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded shadow-md transition text-lg"
          >
            Sell All Products
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cartItems.length > 0 ? cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-1"><b>Product ID:</b> {item.product_id}</p>
              <p className="text-gray-600 text-sm mb-3"><b>Price:</b> ₹{item.price}</p>
              <p className="text-gray-600 text-sm mb-3"><b>Quantity:</b> {item.quantity}</p>

              {/* Customer Inputs */}
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={item.customerName || ''}
                  onChange={(e) => handleCustomerChange(item.id, 'customerName', e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Customer ID"
                  value={item.customerId || ''}
                  onChange={(e) => handleCustomerChange(item.id, 'customerId', e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  required
                />
                <input
                  type="date"
                  value={item.date || ''}
                  onChange={(e) => handleCustomerChange(item.id, 'date', e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                  required
                />
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}