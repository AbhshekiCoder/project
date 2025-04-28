"use client"
import Navbar from '@/components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState()
  let data = async() =>{
    let token = localStorage.getItem("token")
    let result = await axios.post("http://localhost:5000/cart_fetch/cart_fetch", {token: token});
    console.log(result.data)
    if(result.data.success){
      setCartItems(result.data.data)
      console.log(result.data.data)
    }

  }
  const increaseQuantity = async(productId, num) => {
    console.log("hello")
    let token = localStorage.getItem("token");
    let obj = {
      user_id: token,
      product_id: productId,
      quantity: num + 1
    }
    let result = await axios.post("http://localhost:5000/cart/cart", obj);
    console.log(result.data)
    
    data()

    
  };

  const decreaseQuantity = async(productId, num) => {
    let token = localStorage.getItem("token");
    let obj = {
      user_id: token,
      product_id: productId,
      quantity: num - 1
    }
    let result = await axios.post("http://localhost:5000/cart/cart", obj);
    console.log(result.data)
    
    data()

  };

  const handleCustomerChange = (productId, field, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSellProduct = (product) => {
    console.log('Sold Product:', product);
    alert(`Sold ${product.name} to ${product.customerName} (Customer ID: ${product.customerId})`);
    setCartItems((prev) => prev.filter((item) => item.id !== product.id));

  };
  useEffect(()=>{
    data()

  },[])

  return (
    <> 
    <Navbar/>
    <div className="min-h-screen bg-[#E8F5E9] px-4 py-6 sm:px-8">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cartItems?cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-1"><b>Product ID:</b> {item.product_id}</p>
              <p className="text-gray-600 text-sm mb-3"><b>Price:</b> ₹{item.price}</p>

              {/* Quantity Control */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => decreaseQuantity(item.product_id, item.quantity)}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.product_id, item.quantity)}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </div>

              {/* Customer Inputs */}
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={item.customerName}
                  onChange={(e) => handleCustomerChange(item.id, 'customerName', e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <input
                  type="text"
                  placeholder="Customer ID"
                  value={item.customerId}
                  onChange={(e) => handleCustomerChange(item.id, 'customerId', e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Sell Button */}
            <button
              onClick={() => handleSellProduct(item)}
              className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded shadow-md transition"
            >
              Sell Product
            </button>
          </div>
        )):''}
      </div>
    </div>
    </>
  );
}
