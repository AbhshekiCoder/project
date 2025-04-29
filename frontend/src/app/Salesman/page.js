"use client"
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { cartinfo } from '../../feature/cart';
import { userinfo } from '@/feature/userinfo';
import { useRouter } from 'next/navigation';
export default function SalesmanPage() {
  let router = useRouter()
  let dispatch = useDispatch()
  let user =  useSelector((state) => state.name.value)
  let cart = useSelector((state) => state.cart.value)
  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;

  // Fetch Products from API
  const generateProducts = async() => {
    try {
      const result = await axios.get('https://project-aec1.onrender.com/product/product');
      if (result.data.success) {
        let array = result.data.data.filter(Element => Element.distributor == user.distributorship)
        console.log(result.data.data)
        setProductsData(array);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
generateProducts()
  

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

  const handleSell = async(product) => {
    console.log(product)
    let token = localStorage.getItem("token");
    
    let obj = {
      
      name: product.name,
      price: product.price,
      quantity: 1,
      user_id: token,
      product_id: product.HSN
      
    }

    let result = await axios.post("http://localhost:5000/cart/cart", obj)
    if(result.data.success){
      alert(result.data.message)
      dispatch(cartinfo(cart + 1))

      localStorage.setItem("cart", cart + 1 )
      localStorage.setItem( product._id,   1);
    }

   
    
  };
  
    let data = async() =>{
      let token = localStorage.getItem("token");
      console.log(token)
      if(token){
        let result = await axios.post("http://localhost:5000/user/user", {token: token});
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
    useEffect(() =>{
  
      data()
      dispatch(cartinfo(localStorage.getItem("cart")||0))
      console.log("hello")
    
  
    },[])

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#F1F8E9] px-6 py-10">
     <div className = "flex justify-end p-3" onClick={() =>{router.push("./Cart")}}><div><i class="fa-solid fa-cart-shopping text-3xl text-green-900"></i><div>{cart}</div></div></div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto mb-8">
        <input
          type="text"
          
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-md border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Prices</option>
          <option value="below50">Below ₹50</option>
          <option value="50to100">₹50 – ₹100</option>
          <option value="above100">Above ₹100</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {currentProducts?currentProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-green-100 shadow-sm rounded-lg p-3 hover:shadow-md transition"
          >
            <h3 className="text-sm font-medium text-green-800 truncate">{product.name}</h3>
            <p className="text-xs text-gray-600">Price: ₹{product.price}</p>
            <p className="text-xs text-gray-600">Qty: {product.quantity}</p>
            <p className="text-xs text-gray-600">Distributorship: {product.distributor}</p>
            <button
              onClick={() => handleSell(product)}
              className="mt-2 w-full text-sm bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        )):<div>loading...</div>}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-green-800 font-semibold text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
}
