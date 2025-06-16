"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiDownload, FiPlus, FiEdit, FiTrash2, FiX, FiPrinter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaSearch, FaFilter} from 'react-icons/fa';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';


import url from '@/misc/url';
import { io } from 'socket.io-client';

const Accountant = () => {
  const [showChat, setShowChat] = useState(false);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');


  const socket = io("http://localhost:5000");
  let sale_data = async ()=>{
     const salesResponse = await axios.get(`${url}sales_fetch/sales_fetch`);
        if (salesResponse.data.success) {
          setSales(salesResponse.data.data);
          console.log(salesResponse.data.data);
        }
          // After fet ching data
      
  }
  

  const sendMessage = () => {
  if (newMessage.trim()) {
    const messageData = {
      sender: 'Accountant',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    console.log(messageData)
    socket.emit('send_message', messageData);
  
    
   

  }
};
 useEffect(()=>{
  

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

 socket.on('receive_message', (data)=>{
 if(data.type === "products"){
  alert(`${data.message}`);
  return;
 }
 console.log(data.message)
    setMessages(prev => [...prev, data]);
    setNewMessage("")

 
  sale_data();
 })
  

  
 

  return () => {
    socket.off('connect');
    socket.off('connect_error');
    socket.off('receive_message')

  }
  },[])
 const [activeTab, setActiveTab] = useState('products');
  const [selectedDistributor, setSelectedDistributor] = useState('Balaji');
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [todayPurchases, setTodayPurchases] = useState([]);
  const [todaySales, setTodaySales] = useState([]);

  // Data states
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form visibility states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

 
  // Form data states
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    quantity: '',
    box: '',
    CGST: '',
    SGST: '',
    HSN: '',
    distributor: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newPurchase, setNewPurchase] = useState({
    products: [],
    distributor: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'cash',
    paymentRef: '',
    paymentStatus: 'paid'
  });

  // Payment update state
  const [paymentUpdate, setPaymentUpdate] = useState({
    id: '',
    product: '',
    shop: '',
    quantity: '',
    price: '',
    amount: '',
    mode: 'cash',
    ref: '',
    CGST: '',
    SGST: '',
    HSN: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  // Bulk update state
  const [bulkUpdate, setBulkUpdate] = useState({
    customer: '',
    sales: [],
    mode: 'cash',
    ref: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  // Constants
  const distributors = ['All', 'Balaji', 'Namkeen', 'Colgate', 'Coahclate'];
  const paymentStatuses = ['pending', 'paid', 'half'];
  const paymentModes = ['cash', 'cheque', 'online', 'card', 'upi'];

  // Theme colors
  const theme = {
    primary: '#5D8736',
    secondary: '#809D3C',
    accent: '#A9C46C',
    background: '#F4FFC3',
    text: '#2C3E50',
    lightText: '#7F8C8D',
    border: '#BDC3C7',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F39C12'
  };

  // Data filtering function
  const filterData = useCallback((data) => {
    let filtered = [...data];
    
    // Filter by selected distributor
    if (selectedDistributor !== 'All') {
      filtered = filtered.filter(item => 
        item.distributor === selectedDistributor || 
        item.distributorship === selectedDistributor
      );
    }
    
    // Apply global search filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(item =>
        Object.entries(item).some(([key, val]) => {
          // Skip certain fields from search
          if (['_id', '__v', 'product_id', 'accountant_id'].includes(key)) return false;
          return val && val.toString().toLowerCase().includes(searchTerm);
        })
      );
    }
    
    // Apply date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Include entire end day

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date || item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    return filtered;
  }, [selectedDistributor, globalFilter, dateRange]);
const filterTodaysTransactions = useCallback(() => {
  const today = new Date().toISOString().split('T')[0];
  filterTransactionsByDate(today, today);
}, [purchases, sales]);
  // Group sales by shop
 const groupSalesByDateAndCustomer = useCallback((salesData) => {
  const grouped = {};
  
  // Ensure salesData is an array before processing
  if (!Array.isArray(salesData)) return grouped;
  
  salesData.forEach(sale => {
    if (!sale) return; // Skip if sale is null/undefined
    
    const saleDate = sale.date || sale.createdAt?.split('T')[0] || 'Unknown Date';
    const customer = sale.customerName || sale.salesMan || 'Unknown Customer';
    const key = `${saleDate}-${customer}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        date: saleDate,
        customer,
        sales: []
      };
    }
    
    grouped[key].sales.push(sale);
  });
  
  return grouped;
}, []);


  // Memoized filtered data
  const filteredProducts = useMemo(() => {
    return filterData(products);
  }, [products, filterData]);

  const filteredPurchases = useMemo(() => {
    return filterData(purchases);
  }, [purchases, filterData]);

  const filteredSales = useMemo(() => {
    return filterData(sales);
  }, [sales, filterData]);

 const groupedSales = useMemo(() => {
  return groupSalesByDateAndCustomer(filteredSales);
}, [filteredSales, groupSalesByDateAndCustomer]);
  // Group sales by shop
  
  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("hello")
        // Fetch products (inventory)
        const productsResponse = await axios.get(`${url}product/product`);
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data);
          console.log(productsResponse.data.data)
          console.log(products)
        }
        
         //Fetch purchases (sales with type=purchase)
        const purchasesResponse = await axios.get(`${url}purchase`);
        if (purchasesResponse.data.success) {
          setPurchases(purchasesResponse.data.data);
         
        }
        
        // Fetch sales (sales with type=sale)
       const salesResponse = await axios.get(`${url}sales_fetch/sales_fetch`);
        if (salesResponse.data.success) {
          setSales(salesResponse.data.data);
          console.log(salesResponse.data.data);
        }
          // After fet ching data
    
      
        
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Product form handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    const inputs = document.querySelectorAll('input[type="number"]');
    console.log(inputs)
    let hasNegative = false;

    inputs.forEach(input => {
      if (parseFloat(input.value) < 0) {
        hasNegative = true;
        input.style.borderColor = 'red'; // Optional: highlight the error
      } else {
        input.style.borderColor = ''; // Reset if valid
      }
    });

    if (hasNegative) {
      e.preventDefault();
      alert("Please remove negative values from the form.");
      return;
    }
  
    try {
      setLoading(true);
      
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        box: Number(newProduct.box) || 0,
        CGST: Number(newProduct.CGST) || 0,
        SGST: Number(newProduct.SGST) || 0,
        HSN: Number(newProduct.HSN) || 0,
        date: newProduct.date
      };
   
      const endpoint = newProduct._id 
        ? `${url}inventory/update/${newProduct._id}`
        : `${url}inventory/inventory`;
        
      const method = newProduct._id ? 'put' : 'post';
      
      const response = await axios[method](endpoint, productData);
      
      if (response.data.success) {
          setProducts(response.data.data);
        
        resetProductForm();
        setShowProductForm(false);
      }
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setNewProduct({ 
      name: '', 
      price: '', 
      quantity: '',
      box: '',
      CGST: '',
      SGST: '',
      HSN: '',
      distributor: '',
      date: new Date().toISOString().split('T')[0]
    });
  };
// Add this utility function to clear the date range
const clearDateRange = () => {
  setDateRange({
    startDate: '',
    endDate: ''
  });
  // If you need to reset the filtered data when clearing dates, add:
  filterTransactionsByDate('', '');
};
  // Purchase form handlers
  const handlePurchaseSubmit = async (e) => {
    try {
      const inputs = document.querySelectorAll('input[type="number"]');
    console.log(inputs)
    let hasNegative = false;

    inputs.forEach(input => {
      if (parseFloat(input.value) < 0) {
        hasNegative = true;
        input.style.borderColor = 'red'; // Optional: highlight the error
      } else {
        input.style.borderColor = ''; // Reset if valid
      }
    });

    if (hasNegative) {
      e.preventDefault();
      alert("Please remove negative values from the form.");
      return;
    }
  
      if (!newPurchase.products?.length) {
        setError('Please select at least one product');
        return;
      }
      setLoading(true);
      
     const purchaseData = {
  ...newPurchase,
  product_name: newPurchase.products.map(p => p.name).join(', '),
  product_id: newPurchase.products[0]?.id || '',
  price: newPurchase.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
  quantity: newPurchase.products.reduce((sum, p) => sum + p.quantity, 0),
  box: newPurchase.products.reduce((sum, p) => sum + (p.box || 0), 0),
  itemsPerBox: newPurchase.products[0]?.itemsPerBox || 1, // Include items per box
  payment: newPurchase.paymentStatus,
  type: 'purchase',
  date: newPurchase.date,
  CGST: newPurchase.products.reduce((sum, p) => sum + (p.CGST || 0), 0),
  SGST: newPurchase.products.reduce((sum, p) => sum + (p.SGST || 0), 0),
  HSN: newPurchase.products[0]?.HSN || '',
  payment_type: newPurchase.paymentMode,
  salesMan: 'Accountant',
  distributor: newPurchase.distributor,
  products: newPurchase.products,
  ref: newPurchase.paymentRef
};
      console.log(purchaseData)

      const response = await axios.put(`${url}purchase/update`, {
        purchaseData: {
          ...purchaseData,
          // Ensure products array exists
          products: newPurchase.products || []
        }
      });
  
      // Verify response structure
      if (response.data.success) {
        setPurchases(prev => [...prev, ...response.data.data]);
        console.log(response.data.data)
        printPurchaseBill(purchaseData); // Print first item
        resetPurchaseForm();
        setShowPurchaseForm(false);
      // After fetching data
      filterTodaysTransactions();
      
        
        // Refresh inventory after purchase
        const inventoryResponse = await axios.get(`${url}product/product`);
        if (inventoryResponse.data.success) {
          setProducts(inventoryResponse.data.data);
          console.log(inventoryResponse.data.data)
        }
      }
    } catch (err) {
      setError('Failed to add purchase');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPurchaseForm = () => {
  setNewPurchase({
    products: [],
    distributor: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'cash',
    paymentRef: '',
    paymentStatus: 'paid' // Add this line
  });
};

  // Payment update handlers
  const handlePaymentUpdate = async (e) => {
    try {
    const inputs = document.querySelectorAll('input[type="number"]');
    console.log(inputs)
    let hasNegative = false;

    inputs.forEach(input => {
      if (parseFloat(input.value) < 0) {
        hasNegative = true;
        input.style.borderColor = 'red'; // Optional: highlight the error
      } else {
        input.style.borderColor = ''; // Reset if valid
      }
    });

    if (hasNegative) {
      e.preventDefault();
      alert("Please remove negative values from the form.");
      return;
    }
  
      setLoading(true);
      const sale = sales.find(s => s._id === paymentUpdate.id);
      if (!sale) return;

      const updateData = {
        payment: paymentUpdate.status,
        payment_type: paymentUpdate.mode,
        ref: paymentUpdate.ref,
        date: paymentUpdate.date,
        price: paymentUpdate.price,
        quantity: paymentUpdate.quantity,
        amount: paymentUpdate.amount
      };

      const response = await axios.put(`${url}sales/update/${paymentUpdate.id}`, updateData);
      
      if(response.data.success) {
        setSales(sales.map(s => 
          s._id === paymentUpdate.id ? response.data.data : s
        ));
        resetPaymentUpdate();
      
      }
    } catch (err) {
      setError('Failed to update payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentUpdate = () => {
    setPaymentUpdate({
      id: '',
      product: '',
      shop: '',
      quantity: '',
      price: '',
      amount: '',
      mode: 'cash',
      ref: '',
      CGST: '',
      SGST: '',
      HSN: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Bulk update handler
  const handleBulkPaymentUpdate = async (e) => {
    try {
    const inputs = document.querySelectorAll('input[type="number"]');
    console.log(inputs)
    let hasNegative = false;

    inputs.forEach(input => {
      if (parseFloat(input.value) < 0) {
        hasNegative = true;
        input.style.borderColor = 'red'; // Optional: highlight the error
      } else {
        input.style.borderColor = ''; // Reset if valid
      }
    });

    if (hasNegative) {
      e.preventDefault();
      alert("Please remove negative values from the form.");
      return;
    }
  
      setLoading(true);
      const updates = bulkUpdate.sales.map(sale => ({
        id: sale._id,
        updates: {
          payment: bulkUpdate.status,
          payment_type: bulkUpdate.mode,
          quantity: sale.quantity,
          ref: bulkUpdate.ref,
          
          date: bulkUpdate.date,
    
          price: sale.price,
          amount: sale.quantity * sale.price,
          product_name: sale.product_name,
          
        }
      }));
    
      const responses = await Promise.all(
        updates.map(update => 
         
          axios.put(`${url}sales/update/${update.id}`,{obj: update.updates})
          
        )
      );

      const salesResponse = await axios.get(`${url}sales_fetch/sales_fetch`);
        if (salesResponse.data.success) {
          setSales(salesResponse.data.data);
         
           

        }
    
        resetBulkUpdate();
    } catch (err) {
      setError('Failed to update payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetBulkUpdate = () => {
    setBulkUpdate({
      shop: '',
      sales: [],
      mode: 'cash',
      ref: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Product selection for purchase
  const handleBulkPurchaseAdd = useCallback((selectedProducts) => {
  const productsWithDetails = selectedProducts.map(product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    quantity: product.quantity || 1, // Default to 1 if not specified
    itemsPerBox: product.itemsPerBox || 1, // Default items per box
    box: Math.ceil((product.quantity || 1) / (product.itemsPerBox || 1)), // Calculate initial boxes
    CGST: product.CGST || 0,
    SGST: product.SGST || 0,
    HSN: product.HSN || ''
  }));
  
  setNewPurchase(prev => ({
    ...prev,
    products: productsWithDetails,
    distributor: selectedProducts[0]?.distributor || ''
  }));
}, []);

  // Delete product handler
  const handleProductDelete = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${url}inventory/delete/${productId}`);
      
      if (response.data.success) {
        setProducts(products.filter(p => p._id !== productId));
      }
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const UpdatedeleteSales = async (id) =>{
    try{
      let result = await axios.delete(`${url}sales/delete/${id}`);
      if(result.data.success){
         setSales(sales.filter(p => p._id !== id));
      
      }
    }catch(err){
      console.log(err.message);
    }
  }
  function numberToWords(num) {
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanOneThousand(num) {
    if (num === 0) return '';
    if (num < 10) return single[num];
    if (num < 20) return double[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const remainder = num % 10;
      return tens[ten] + (remainder ? ' ' + single[remainder] : '');
    }
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return single[hundred] + ' Hundred' + (remainder ? ' ' + convertLessThanOneThousand(remainder) : '');
  }
  
  const numStr = num.toString().split('.');
  const wholeNum = parseInt(numStr[0]);
  const decimalNum = numStr[1] ? parseInt(numStr[1].substring(0, 2)) : 0;
  
  let result = '';
  if (wholeNum > 0) {
    result = convertLessThanOneThousand(wholeNum) + ' Rupees';
  }
  if (decimalNum > 0) {
    result += (result ? ' and ' : '') + convertLessThanOneThousand(decimalNum) + ' Paise';
  }
  return result || 'Zero Rupees';
}
  
  // Print functions
  const printBill = useCallback((sale) => {
    const billWindow = window.open('', '', 'width=600,height=600');
    billWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${sale.salesMan}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #2d3748; border-bottom: 2px solid #2d3748; padding-bottom: 10px; }
            .bill-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .bill-details { margin-top: 20px; }
            .bill-row { display: flex; margin-bottom: 10px; }
            .bill-label { font-weight: bold; width: 150px; }
            .thank-you { margin-top: 30px; font-style: italic; text-align: center; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
            .tax-details { margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="bill-header">
            <div>
              <h2>Invoice Receipt</h2>
              <p>Date: ${new Date(sale.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Invoice #: ${sale._id || Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>
          
          <div class="bill-details">
            <div class="bill-row">
              <div class="bill-label">Shop:</div>
              <div>${sale.salesMan || 'N/A'}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${sale.product_name || 'N/A'}</td>
                <td>${sale.quantity || '0'}</td>
                <td>₹${sale.price || '0'}</td>
                <td>₹${(sale.quantity * sale.price).toFixed(2) || '0'}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total">
            Total Amount: ₹${(sale.quantity * sale.price).toFixed(2) || '0'}
          </div>
          
          <div class="tax-details">
            <div class="bill-row">
              <div class="bill-label">Payment Mode:</div>
              <div>${sale.mode || 'N/A'}</div>
            </div>
            <div class="bill-row">
              <div class="bill-label">Payment Status:</div>
              <div>${sale.payment || 'N/A'}</div>
            </div>
          </div>
          
          <div class="thank-you">Thank you for your business!</div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    billWindow.document.close();
  }, []);

  // Print bill for all products in a shop
const printShopBill = useCallback((customerName, customerSales, date) => {
  const billWindow = window.open('', '', 'width=800,height=1000');
  const totalAmount = customerSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
  const taxableValue = totalAmount / 1.18; // Assuming 18% GST
  const cgst = taxableValue * 0.09;
  const sgst = taxableValue * 0.09;
  
  billWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tax Invoice</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
      </style>
    </head>
    <body class="bg-gray-100">
      <div class="mx-auto my-8 p-0 w-[210mm] h-[297mm] bg-white shadow-md">
        <!-- Invoice Header -->
        <div class="p-8">
          <div class="flex justify-between">
            <p class="text-gray-700 text-sm">Invoice No.: <span class="text-black font-medium">SALE-${Math.floor(Math.random() * 10000)}</span></p>
            <p class="text-gray-700 text-sm">Dated: <span class="text-black font-medium">${date}</span></p>
          </div>
          <p class="text-gray-700 text-sm">Ref. No.: ${customerSales[0]?.ref || 'N/A'}</p>

          <!-- Company Details -->
          <div class="text-center mt-4">
            <h2 class="text-gray-800 text-xl font-normal">SHREE SHIV SHAKTI TRADERS</h2>
            <p class="text-gray-600 text-sm mt-1">
              640 BHAGIRATHPURA INDORE<br>
              GSTIN/UIN: 23AEZF5338B1ZM<br>
              State: Madhya Pradesh, Code : 23<br>
              Contact: 9926945300<br>
              E-Mail: shreeshivshaktitraders78@gmail.com
            </p>
          </div>

          <!-- Invoice Title -->
          <h1 class="text-2xl text-center font-medium mt-6 mb-4">Tax Invoice</h1>

          <!-- Customer Details -->
          <div class="mx-auto text-center">
            <div class="flex justify-center">
              <p class="text-gray-600 mr-1">Customer:</p>
              <div>
                <p class="text-sm font-medium">${customerName}</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm">State Name: Madhya Pradesh, Code: 23</p>
          </div>

          <!-- Items Table -->
          <table class="w-full border-collapse border border-gray-500 mt-6 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-500 p-1 text-center">Sr. No.</th>
                <th class="border border-gray-500 p-1 text-left pl-2 w-60">Desc of Goods</th>
                <th class="border border-gray-500 p-1">HSN/SAC</th>
                <th class="border border-gray-500 p-1">Quantity</th>
                <th class="border border-gray-500 p-1">Rate<br><span class="text-xs font-light">(inclusive of tax)</span></th>
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Per</th>
                <th class="border border-gray-500 p-1">Disc%</th>
                <th class="border border-gray-500 p-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${customerSales.map((sale, index) => `
                <tr>
                  <td class="border border-gray-500 p-1 text-center">${index + 1}</td>
                  <td class="border border-gray-500 p-1 pl-2">${sale.product_name}</td>
                  <td class="border border-gray-500 p-1 text-center">${sale.HSN || 'N/A'}</td>
                  <td class="border border-gray-500 p-1 text-center">${sale.quantity}</td>
                  <td class="border border-gray-500 p-1 text-center">${sale.price.toFixed(2)}</td>
                  <td class="border border-gray-500 p-1 text-center">${(sale.price / 1.18).toFixed(2)}</td>
                  <td class="border border-gray-500 p-1 text-center">pcs</td>
                  <td class="border border-gray-500 p-1 text-center"></td>
                  <td class="border border-gray-500 p-1 text-center">${(sale.quantity * sale.price).toFixed(2)}</td>
                </tr>
              `).join('')}
              <!-- Total Rows -->
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">Total</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">CGST @9%</td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">SGST @9%</td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-right pr-2 font-semibold">Grand Total</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${customerSales.reduce((sum, sale) => sum + sale.quantity, 0)} Pcs</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td colspan="3" class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">₹ ${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Amount in Words -->
          <div class="mt-2">
            <div class="flex justify-between">
              <p class="text-sm text-gray-700">Amount Chargeable (in words)</p>
              <p class="text-sm text-gray-700">E. & O.E.</p>
            </div>
            <p class="text-sm font-semibold">${numberToWords(totalAmount)} Only</p>
          </div>

          <!-- Tax Breakdown -->
          <table class="w-full border-collapse border border-gray-500 mt-4 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th rowspan="2" class="border border-gray-500 p-1">HSN/SAC</th>
                <th rowspan="2" class="border border-gray-500 p-1">Taxable Value</th>
                <th colspan="2" class="border border-gray-500 p-1">Central Tax</th>
                <th colspan="2" class="border border-gray-500 p-1">State Tax</th>
                <th rowspan="2" class="border border-gray-500 p-1">Total Tax Amount</th>
              </tr>
              <tr class="bg-gray-100">
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Amount</th>
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-500 p-1 text-center">${customerSales[0]?.HSN || 'N/A'}</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">9%</td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">9%</td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">${(cgst + sgst).toFixed(2)}</td>
              </tr>
              <tr class="font-semibold">
                <td class="border border-gray-500 p-1 text-center">Total</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">${(cgst + sgst).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bank Details -->
          <div class="mt-4 text-sm">
            <p>Tax Amount (in words): <span class="font-semibold">${numberToWords(cgst + sgst)} Only</span></p>
            <p class="mt-1">Company's Bank Details</p>
            <p>Bank Name: <span class="font-semibold">CANARA BANK</span></p>
            <p>A/c No.: <span class="font-semibold">120023705805</span></p>
            <p>Branch & IFSC Code: <span class="font-semibold">PALASIYA INDORE & CNRB0002074</span></p>
          </div>

          <!-- Payment Info -->
          <div class="mt-4 text-sm">
            <p>Payment Mode: <span class="font-semibold">${customerSales[0]?.mode || 'Cash'}</span></p>
            <p>Payment Status: <span class="font-semibold">${customerSales[0]?.payment || 'Pending'}</span></p>
          </div>

          <!-- Footer -->
          <div class="flex mt-6 text-sm">
            <div class="w-1/2">
              <p class="underline">Declaration</p>
              <p class="text-xs mt-1">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </div>
            <div class="w-1/2 flex items-end justify-end">
              <p class="text-right">for SHREE SHIV SHAKTI TRADERS</p>
            </div>
          </div>
          <p class="text-right mt-2 text-sm">Authorised Signatory</p>
          <p class="text-center mt-4 underline text-sm">This is a Computer Generated Invoice</p>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 500);
      </script>
    </body>
    </html>
  ` );
  billWindow.document.close();
}, []);

  // Print purchase bill
 const printPurchaseBill = useCallback((purchase) => {
 const billWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!billWindow || billWindow.closed || typeof billWindow.closed === 'undefined') {
      alert('Please allow popups for this site to print bills');
      return;
    }
  const today = new Date().toISOString().split('T')[0];
  
  const totalAmount = purchase.products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0);
  
  const taxableValue = totalAmount / 1.18; // Assuming 18% GST (9% CGST + 9% SGST)
  const cgst = taxableValue * 0.09;
  const sgst = taxableValue * 0.09;
  
  billWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tax Invoice</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
      </style>
    </head>
    <body class="bg-gray-100">
      <div class="mx-auto my-8 p-0 w-[210mm] h-[297mm] bg-white shadow-md">
        <!-- Invoice Header -->
        <div class="p-8">
          <div class="flex justify-between">
            <p class="text-gray-700 text-sm">Invoice No.: <span class="text-black font-medium">${purchase._id || 'PUR-' + Math.floor(Math.random() * 10000)}</span></p>
            <p class="text-gray-700 text-sm">Dated: <span class="text-black font-medium">${purchase.date || today}</span></p>
          </div>
          <p class="text-gray-700 text-sm">Ref. No.: ${purchase.paymentRef || 'N/A'}</p>

          <!-- Company Details -->
          <div class="text-center mt-4">
            <h2 class="text-gray-800 text-xl font-normal">SHREE SHIV SHAKTI TRADERS</h2>
            <p class="text-gray-600 text-sm mt-1">
              640 BHAGIRATHPURA INDORE<br>
              GSTIN/UIN: 23AEZF5338B1ZM<br>
              State: Madhya Pradesh, Code : 23<br>
              Contact: 9926945300<br>
              E-Mail: shreeshivshaktitraders78@gmail.com
            </p>
          </div>

          <!-- Invoice Title -->
          <h1 class="text-2xl text-center font-medium mt-6 mb-4">Tax Invoice</h1>

          <!-- Supplier Details -->
          <div class="mx-auto text-center">
            <div class="flex justify-center">
              <p class="text-gray-600 mr-1">Supplier:</p>
              <div>
                <p class="text-sm font-medium">${purchase.distributor || 'N/A'}</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm">State Name: Madhya Pradesh, Code: 23</p>
          </div>

          <!-- Items Table -->
          <table class="w-full border-collapse border border-gray-500 mt-6 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-500 p-1 text-center">Sr. No.</th>
                <th class="border border-gray-500 p-1 text-left pl-2 w-60">Desc of Goods</th>
                <th class="border border-gray-500 p-1">HSN/SAC</th>
                <th class="border border-gray-500 p-1">Quantity</th>
                <th class="border border-gray-500 p-1">Rate<br><span class="text-xs font-light">(inclusive of tax)</span></th>
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Per</th>
                <th class="border border-gray-500 p-1">Disc%</th>
                <th class="border border-gray-500 p-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${purchase.products.map((product, index) => `
                <tr>
                  <td class="border border-gray-500 p-1 text-center">${index + 1}</td>
                  <td class="border border-gray-500 p-1 pl-2">${product.name}</td>
                  <td class="border border-gray-500 p-1 text-center">${product.HSN || 'N/A'}</td>
                  <td class="border border-gray-500 p-1 text-center">${product.quantity}</td>
                  <td class="border border-gray-500 p-1 text-center">${(product.price).toFixed(2)}</td>
                  <td class="border border-gray-500 p-1 text-center">${(product.price / 1.18).toFixed(2)}</td>
                  <td class="border border-gray-500 p-1 text-center">pcs</td>
                  <td class="border border-gray-500 p-1 text-center"></td>
                  <td class="border border-gray-500 p-1 text-center">${(product.price * product.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <!-- Total Rows -->
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">Total</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">CGST @9%</td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border-l border-b border-gray-500 p-1 text-right pr-2 font-semibold" colspan="7">SGST @9%</td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-right pr-2 font-semibold">Grand Total</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${purchase.products.reduce((sum, p) => sum + p.quantity, 0)} Pcs</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td colspan="3" class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">₹ ${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Amount in Words -->
          <div class="mt-2">
            <div class="flex justify-between">
              <p class="text-sm text-gray-700">Amount Chargeable (in words)</p>
              <p class="text-sm text-gray-700">E. & O.E.</p>
            </div>
            <p class="text-sm font-semibold">${numberToWords(totalAmount)} Only</p>
          </div>

          <!-- Tax Breakdown -->
          <table class="w-full border-collapse border border-gray-500 mt-4 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th rowspan="2" class="border border-gray-500 p-1">HSN/SAC</th>
                <th rowspan="2" class="border border-gray-500 p-1">Taxable Value</th>
                <th colspan="2" class="border border-gray-500 p-1">Central Tax</th>
                <th colspan="2" class="border border-gray-500 p-1">State Tax</th>
                <th rowspan="2" class="border border-gray-500 p-1">Total Tax Amount</th>
              </tr>
              <tr class="bg-gray-100">
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Amount</th>
                <th class="border border-gray-500 p-1">Rate</th>
                <th class="border border-gray-500 p-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-500 p-1 text-center">${purchase.products[0]?.HSN || 'N/A'}</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">9%</td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">9%</td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">${(cgst + sgst).toFixed(2)}</td>
              </tr>
              <tr class="font-semibold">
                <td class="border border-gray-500 p-1 text-center">Total</td>
                <td class="border border-gray-500 p-1 text-center">${taxableValue.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${cgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center"></td>
                <td class="border border-gray-500 p-1 text-center">${sgst.toFixed(2)}</td>
                <td class="border border-gray-500 p-1 text-center">${(cgst + sgst).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bank Details -->
         
<div class="mt-4 text-sm">
  <p>Tax Amount (in words): <span class="font-semibold">${numberToWords(cgst + sgst)} Only</span></p>
  <p class="mt-1">Company's Bank Details</p>
  <p>Bank Name: <span class="font-semibold">CANARA BANK</span></p>
  <p>A/c No.: <span class="font-semibold">120023705805</span></p>
  <p>Branch & IFSC Code: <span class="font-semibold">PALASIYA INDORE & CNRB0002074</span></p>
  
  <!-- Add Payment Information here -->
  <div class="mt-2">
    <p>Payment Mode: <span class="font-semibold">${purchase.paymentMode || 'Cash'}</span></p>
    <p>Payment Status: <span class="font-semibold">${purchase.payment || 'Paid'}</span></p>
    ${purchase.paymentRef ? `<p>Reference: <span class="font-semibold">${purchase.paymentRef}</span></p>` : ''}
  </div>
</div>

          <!-- Footer -->
          <div class="flex mt-6 text-sm">
            <div class="w-1/2">
              <p class="underline">Declaration</p>
              <p class="text-xs mt-1">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            </div>
            <div class="w-1/2 flex items-end justify-end">
              <p class="text-right">for SHREE SHIV SHAKTI TRADERS</p>
            </div>
          </div>
          <p class="text-right mt-2 text-sm">Authorised Signatory</p>
          <p class="text-center mt-4 underline text-sm">This is a Computer Generated Invoice</p>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 500);
      </script>
    </body>
    </html>
  `);
  billWindow.document.close();
  setTimeout(() => {
      if (!billWindow.closed) {
        billWindow.print();
        // Don't close immediately to give time for print dialog
        setTimeout(() => {
          if (!billWindow.closed) {
            billWindow.close();
          }
        }, 1000);
      }
    }, 500);
}, []);
  //today transaction

 const filterTransactionsByDate = (startDate, endDate) => {
  // If only startDate is provided, filter for that single day
  if (startDate && !endDate) {
    endDate = startDate;
  }

  const filteredPurchases = purchases.filter(purchase => {
    const purchaseDate = purchase.date || purchase.createdAt?.split('T')[0];
    return (!startDate || purchaseDate >= startDate) && 
           (!endDate || purchaseDate <= endDate);
  });

  const filteredSales = sales.filter(sale => {
    const saleDate = sale.date || sale.createdAt?.split('T')[0];
    return (!startDate || saleDate >= startDate) && 
           (!endDate || saleDate <= endDate);
  });

  setTodayPurchases(filteredPurchases);
  setTodaySales(filteredSales);
};
const handlePurchaseDelete = async(id) =>{
  let result = await axios.delete(`${url}purchase/delete/${id}`);
  if(result.data.success){
    setPurchases(purchases.filter(p => p._id !== id));
  }
}
  // Export to Excel
  const exportToExcel = useCallback((data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, []);
  
 const handleBoxCalculation = (index, quantity, itemsPerBox) => {
  setNewPurchase(prev => {
    const updatedProducts = [...prev.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      box: Math.ceil(quantity / itemsPerBox)
    };
    return {...prev, products: updatedProducts};
  });
};
 


  const handleProductQuantityChange = (index, newQuantity) => {
    setNewPurchase(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: Math.max(1, newQuantity) // Ensure quantity is at least 1
      };
      return {
        ...prev,
        products: updatedProducts
      };
    });
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
       
          return (
            <>
              <div className="flex justify-between items-center mb-4 p-3">
                <div className="flex space-x-4 ">
                  <input 
                    type="text" 
                    className="border p-2 rounded w-64" 
                    placeholder="Search products..." 
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                  <div className="flex space-x-2 items-center">
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.startDate}
      onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
    />
    {dateRange.startDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, startDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        
      </button>
    )}
  </div>
  <span>to</span>
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.endDate}
      onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
    />
    {dateRange.endDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, endDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        
      </button>
    )}
  </div>
  {(dateRange.startDate || dateRange.endDate) && (
    <button 
      onClick={clearDateRange}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Clear
    </button>
  )}
</div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => exportToExcel(filteredProducts, 'products_export')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export
                  </button>
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" 
                    onClick={() => setShowProductForm(true)}
                  >
                    Add Product
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto ">
                <table className="w-full border bg-white shadow rounded ">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Box</th>
                      <th className="p-2 border">Distributor</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product?._id} className={product?.quantity <= 10 ? 'bg-red-50' : ''}>
                          <td className="p-2 border">{product?.name || 'N/A'}</td>
                          <td className="p-2 border">₹{product?.price || '0'}</td>
                          <td className="p-2 border">{product?.quantity || '0'}</td>
                          <td className="p-2 border">{product?.box || '0'}</td>
                          <td className="p-2 border">{product?.distributor || 'N/A'}</td>
                          <td className="p-2 border">{product?.date || 'N/A'}</td>
                          <td className="p-2 border">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  setNewProduct({
                                    name: product?.name || '',
                                    price: product?.price || '',
                                    quantity: product?.quantity || '',
                                    box: product?.box || '',
                                    CGST: product?.CGST || '',
                                    SGST: product?.SGST || '',
                                    HSN: product?.HSN || '',
                                    distributor: product?.distributor || '',
                                    date: product?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
                                    _id: product?._id
                                  });
                                  setShowProductForm(true);
                                }}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => product?._id && handleProductDelete(product._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          );
      
      case 'purchases':
        return (
          <>
            <div className="flex justify-between items-center mb-4 p-3">
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  className="border p-2 rounded w-64" 
                  placeholder="Search purchases..." 
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
               <div className="flex space-x-2 items-center">
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.startDate}
      onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
    />
    {dateRange.startDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, startDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        
      </button>
    )}
  </div>
  <span>to</span>
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.endDate}
      onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
    />
    {dateRange.endDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, endDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        
      </button>
    )}
  </div>
  {(dateRange.startDate || dateRange.endDate) && (
    <button 
      onClick={clearDateRange}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Clear
    </button>
  )}
</div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => exportToExcel(filteredPurchases, 'purchases_export')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export
                </button>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" 
                  onClick={() => setShowPurchaseForm(true)}
                >
                  Add Purchase
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border bg-white shadow rounded">
                <thead>
                  <tr className="bg-green-100">
                    <th className="p-2 border">Distributor</th>
                    <th className="p-2 border">Products</th>
                    <th className="p-2 border">Total Quantity</th>
                    <th className="p-2 border">Total Amount</th>
                    <th className="p-2 border">Payment Mode</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {purchases && filteredPurchases?.map((purchase) => {
  if (!purchase) return null;
  return (
    <tr key={purchase._id}>
      <td className="p-2 border">{purchase.distributor}</td>
      <td className="p-2 border">
        {/* Add null check for products array */}
       
          <div className="mb-1">
            {purchase.product_name} (Qty: {purchase.quantity}, ₹{purchase.price})
          </div>
        
      </td>
      <td className="p-2 border">
       {purchase.quantity}
      </td>
      <td className="p-2 border">
        ₹{purchase.amount}
      </td>
                
                
                      <td className="p-2 border">
                        {purchase.mode || 'Cash'}
                        {purchase.paymentRef && (
                          <div className="text-xs text-gray-500">{purchase.paymentRef}</div>
                        )}
                      </td>
                      <td className="p-2 border">{purchase.date}</td>
                      <td className="p-2 border">
                        <div className="flex space-x-1">
                         
                          <button
                            onClick={() => handlePurchaseDelete(purchase._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                   );
                  })}
  
                </tbody>
              </table>
            </div>
          </>
        );
      
     case 'sales':
  return (
    <>
      <div className="flex justify-between items-center mb-4 p-3">
        <div className="flex space-x-4">
          <input 
            type="text" 
            className="border p-2 rounded w-64" 
            placeholder="Search sales..." 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <div className="flex space-x-2 items-center">
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.startDate}
      onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
    />
    {dateRange.startDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, startDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        
      </button>
    )}
  </div>
  <span>to</span>
  <div className="relative">
    <input 
      type="date" 
      className="border p-2 rounded" 
      value={dateRange.endDate}
      onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
    />
    {dateRange.endDate && (
      <button 
        onClick={() => setDateRange(prev => ({...prev, endDate: ''}))}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    )}
  </div>
  {(dateRange.startDate || dateRange.endDate) && (
    <button 
      onClick={clearDateRange}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Clear
    </button>
  )}
</div>
        </div>
        <button 
          onClick={() => exportToExcel(filteredSales, 'sales_export')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export
        </button>
      </div>
      
      {loading && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">Loading...</div>}
      {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
      
     <div className="overflow-x-auto">
        {Object.values(groupedSales).length > 0 ? (
          Object.values(groupedSales)
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
            .map((group) => (
              <div key={`${group.date}-${group.customer}`} className="mb-8">
              <div className="bg-blue-100 p-3 rounded-t">
                <h3 className="font-bold text-lg">
                  {new Date(group.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <span className="ml-4">Customer: {group.customer}</span>
                </h3>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center bg-gray-100 p-3">
                  <h4 className="font-semibold">{group.customer}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => printShopBill(group.customer, group.sales, group.date)}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      Print All
                    </button>
                    <button
                      onClick={() => setBulkUpdate({
                        customer: group.customer,
                        sales: group.sales,
                        mode: group.sales[0]?.mode || 'cash',
                        ref: group.sales[0]?.ref || '',
                        status: group.sales[0]?.payment || 'pending',
                        date: group.date,
                      })}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Bulk Update
                    </button>
                  </div>
                </div>
                <table className="w-full border bg-white shadow rounded-b">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-2 border">Product</th>
                      <th className="p-2 border">Qty</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Payment</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Distributor</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sales.map((sale) => (
                      <tr key={sale._id}>
                        <td className="p-2 border">{sale.product_name}</td>
                        <td className="p-2 border">{sale.quantity}</td>
                        <td className="p-2 border">₹{sale.price}</td>
                        <td className="p-2 border">₹{sale.quantity * sale.price}</td>
                        <td className="p-2 border">
                          <div>
                            <div className="text-sm">{sale.mode}</div>
                            <div className="text-xs text-gray-500">{sale.ref}</div>
                          </div>
                        </td>
                        <td className="p-2 border">
                          <span className={`px-2 py-1 rounded text-xs ${
                            sale.payment === 'paid' ? 'bg-green-100 text-green-800' :
                            sale.payment === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            sale.payment === 'half-paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sale.payment}
                          </span>
                        </td>
                        <td className="p-2 border">{sale.distributor}</td>
                        <td className="p-2 border">{sale.date}</td>
                        <td className="p-2 border">
                          <div className="flex space-x-1 justify-between">
                            <button
                              onClick={() => setPaymentUpdate({
                                id: sale._id,
                                product: sale.product_name,
                                customer: sale.customerName,
                                quantity: sale.quantity,
                                price: sale.price,
                                amount: sale.quantity * sale.price,
                                mode: sale.mode || 'cash',
                                ref: sale.ref || '',
                                CGST: sale.CGST || '',
                                SGST: sale.SGST || '',
                                HSN: sale.HSN || '',
                                status: sale.payment || 'pending',
                                date: sale.date || new Date().toISOString().split('T')[0],
                              })}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              Update
                            </button>
                          
                            <button 
                              className='bg-red-400 text-white px-2 py-1 rounded text-xs' 
                              onClick={() => UpdatedeleteSales(sale._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add date totals */}
              <div className="bg-gray-50 p-3 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total for {group.customer}:</span>
                  <span>
                    ₹{group.sales.reduce((sum, sale) => 
                      sum + (sale.quantity * sale.price), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
          ) : (
          <div className="p-4 text-center text-gray-500">
            No sales data available
          </div>
          )
    }
      </div>
          
    </>
  );
    
     case 'today':
  return (
    <>
      <div className="flex justify-between items-center mb-4 p-3">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input 
              type="date" 
              className="border p-2 rounded" 
              value={dateRange.startDate}
              onChange={(e) => {
                setDateRange(prev => ({...prev, startDate: e.target.value}));
                filterTransactionsByDate(e.target.value, e.target.value);
              }}
            />
            {dateRange.startDate && (
              <button 
                onClick={() => {
                  setDateRange(prev => ({...prev, startDate: ''}));
                  filterTransactionsByDate('', '');
                }}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                
              </button>
            )}
          </div>
          {dateRange.startDate && (
            <button 
              onClick={() => {
                setDateRange(prev => ({...prev, startDate: ''}));
                filterTransactionsByDate('', '');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        <button 
          onClick={() => exportToExcel([...todayPurchases, ...todaySales], 'transactions_export')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export
        </button>
      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchases */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Purchases</h3>
          {todayPurchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Distributor</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Total Qty</th>
                    <th className="p-2 border">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    todayPurchases.reduce((acc, purchase) => {
                      const key = `${purchase.distributor}_${purchase.product_name}`;
                      if (!acc[key]) {
                        acc[key] = {
                          distributor: purchase.distributor,
                          product_name: purchase.product_name,
                          totalQty: 0,
                          totalAmount: 0
                        };
                      }
                      acc[key].totalQty += purchase.quantity;
                      acc[key].totalAmount += purchase.amount;
                      return acc;
                    }, {})
                  ).map(([key, purchase]) => (
                    <tr key={key}>
                      <td className="p-2 border">{purchase.distributor}</td>
                      <td className="p-2 border">{purchase.product_name}</td>
                      <td className="p-2 border">{purchase.totalQty}</td>
                      <td className="p-2 border">₹{purchase.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No purchases found</p>
          )}
        </div>

        {/* Sales */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Sales</h3>
          {todaySales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Shop</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Total Qty</th>
                    <th className="p-2 border">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    todaySales.reduce((acc, sale) => {
                      const key = `${sale.salesMan}_${sale.product_name}`;
                      if (!acc[key]) {
                        acc[key] = {
                          shop: sale.customerName,
                          product_name: sale.product_name,
                          totalQty: 0,
                          totalAmount: 0
                        };
                      }
                      acc[key].totalQty += sale.quantity;
                      acc[key].totalAmount += sale.amount;
                      return acc;
                    }, {})
                  ).map(([key, sale]) => (
                    <tr key={key}>
                      <td className="p-2 border">{sale.shop}</td>
                      <td className="p-2 border">{sale.product_name}</td>
                      <td className="p-2 border">{sale.totalQty}</td>
                      <td className="p-2 border">₹{sale.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No sales found</p>
          )}
        </div>
      </div>
    </>
  );
      default:
        return null;
    }
  };

  return (
    <>  
 <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.background }}>
      {/* Sidebar */}
      <div className="w-64 p-6 flex flex-col" style={{ backgroundColor: theme.primary, color: 'white' }}>
        <h2 className="text-2xl font-bold mb-6">Accountant Panel</h2>
        
        {/* Distributor Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Distributor</label>
          <select 
            className="w-full p-2 rounded text-black"
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
          >
            {distributors.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            className={`w-full text-left px-3 py-2 rounded transition flex items-center ${activeTab === 'products' ? 'bg-white text-black' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="mr-2">📦</span> All Products
          </button>
          <button 
            className={`w-full text-left px-3 py-2 rounded transition flex items-center ${activeTab === 'purchases' ? 'bg-white text-black' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('purchases')}
          >
            <span className="mr-2">🛒</span> Purchases
          </button>
          <button 
            className={`w-full text-left px-3 py-2 rounded transition flex items-center ${activeTab === 'sales' ? 'bg-white text-black' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('sales')}
          >
            <span className="mr-2">💰</span> Sales
          </button>
          <button 
            className={`w-full text-left px-3 py-2 rounded transition flex items-center ${activeTab === 'today' ? 'bg-white text-black' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('today')}
          >
            <span className="mr-2">📅</span> Today's Transactions
          </button>
        </nav>
      </div>


      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
         {/* Header */}
           <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>
            {activeTab === 'products' && 'Product Inventory'}
            {activeTab === 'purchases' && 'Purchase Records'}
            {activeTab === 'sales' && 'Sales Records'}
            {activeTab === 'today' && "Today's Transactions"}
          </h1>
         {/* Status Messages */}
        {loading && (
          <div className="mb-4 p-3 rounded-lg flex items-center" style={{ backgroundColor: '#E8F5E9' }}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3" style={{ borderColor: theme.primary }}></div>
            <span style={{ color: theme.primary }}>Loading data...</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-center" style={{ backgroundColor: '#FDEDED' }}>
            <span className="text-red-600">{error}</span>
          </div>
        )}
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {renderTabContent()}
        </div>
      </div>

       {/* Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: theme.primary }}>
                {newProduct._id ? 'Edit Product' : 'Add Product'}
              </h3>
              <button 
                onClick={() => {
                  resetProductForm();
                  setShowProductForm(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Product Name</label>
                  <input 
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" 
                    style={{ 
                      borderColor: theme.border,
                      focusRing: theme.accent 
                    }}
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Price</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" 
                      style={{ 
                        borderColor: theme.border,
                        focusRing: theme.accent 
                      }}
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Quantity</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" 
                      style={{ 
                        borderColor: theme.border,
                        focusRing: theme.accent 
                      }}
                      value={newProduct.quantity} 
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      required
                      min={1}
                    />
                  </div>
                </div>
                
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Box Count</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.box} 
                      onChange={(e) => setNewProduct({...newProduct, box: e.target.value})}
                      required
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Distributor</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={newProduct.distributor}
                      onChange={(e) => setNewProduct({...newProduct, distributor: e.target.value})}
                      required
                    >
                      <option value="">Select Distributor</option>
                      {distributors.filter(d => d !== 'All').map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">CGST %</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.CGST} 
                      onChange={(e) => setNewProduct({...newProduct, CGST: e.target.value})}
                      required
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SGST %</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.SGST} 
                      onChange={(e) => setNewProduct({...newProduct, SGST: e.target.value})}
                      required
                      min={1}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">HSN Code</label>
                  <input 
                    type="number"
                    className="w-full border p-2 rounded" 
                    value={newProduct.HSN} 
                    onChange={(e) => setNewProduct({...newProduct, HSN: e.target.value})}
                    required
                    min={1}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date"
                    className="w-full border p-2 rounded" 
                    value={newProduct.date} 
                    onChange={(e) => setNewProduct({...newProduct, date: e.target.value})}
                    required
                  />
                </div>
              </div>
               <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    type="button"
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition" 
                    onClick={() => {
                      resetProductForm();
                      setShowProductForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white transition flex items-center" 
                    style={{ backgroundColor: theme.primary }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : newProduct._id ? (
                      <>
                        <FiEdit className="mr-1" /> Update
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-1" /> Add
                      </>
                    )}
                  </button>
                </div>
              
            </form>
          </div>
        </div>
      
      )}

      {/* Purchase Modal */}

{showPurchaseForm && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl mb-4 font-semibold">Add Bulk Purchase</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Products</label>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border p-2 rounded text-sm"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const productSelect = document.getElementById('productSelect');
                  if (productSelect) {
                    Array.from(productSelect.options).forEach(option => {
                      const product = JSON.parse(option.value);
                      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
                      option.style.display = matchesSearch ? '' : 'none';
                    });
                  }
                }}
              />
            </div>
          </div>
          <select
            id="productSelect"
            multiple
            className="w-full border p-2 rounded h-48"
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions)
                .map(option => JSON.parse(option.value));
              handleBulkPurchaseAdd(selected);
            }}
          >
            {products
              .filter(p => selectedDistributor === 'All' || p.distributor === selectedDistributor)
              .map((product) => (
                <option 
                  key={product._id} 
                  value={JSON.stringify(product)}
                >
                  {product.name} (₹{product.price})
                </option>
              ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold CTRL to select multiple products</p>
        </div>

        {/* Rest of the purchase form remains the same */}
        {newPurchase.products.length > 0 && (
          <>
            <div className="border p-3 rounded">
              <h4 className="font-medium mb-2">Selected Products</h4>
              <table className="w-full border">
                <thead>
  <tr className="bg-gray-100">
    <th className="p-2 border">Product</th>
    <th className="p-2 border">Price</th>
    <th className="p-2 border">Qty</th>
    <th className="p-2 border">Items/Box</th>
    <th className="p-2 border">Boxes</th>
    <th className="p-2 border">CGST</th>
    <th className="p-2 border">SGST</th>
    <th className="p-2 border">HSN</th>
  </tr>
</thead>
                <tbody>
  {newPurchase.products.map((product, index) => (
    <tr key={index}>
      <td className="p-2 border">{product.name}</td>
      <td className="p-2 border">₹{product.price}</td>
      <td className="p-2 border">
        <input
          type="number"
          min="1"
          className="w-20 border p-1 rounded"
          value={product.quantity}
          onChange={(e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            // Update quantity and recalculate boxes
            handleProductQuantityChange(index, newQuantity);
            handleBoxCalculation(index, newQuantity, product.itemsPerBox);
          }}
        />
      </td>
      <td className="p-2 border">
        <input
          type="number"
          min="1"
          className="w-20 border p-1 rounded"
          value={product.itemsPerBox}
          onChange={(e) => {
            const newItemsPerBox = parseInt(e.target.value) || 1;
            // Update items per box and recalculate boxes
            setNewPurchase(prev => {
              const updatedProducts = [...prev.products];
              updatedProducts[index] = {
                ...updatedProducts[index],
                itemsPerBox: newItemsPerBox
              };
              return {...prev, products: updatedProducts};
            });
            handleBoxCalculation(index, product.quantity, newItemsPerBox);
          }}
        />
      </td>
      <td className="p-2 border">
        <input
          type="number"
          min="1"
          className="w-20 border p-1 rounded"
          value={product.box}
          readOnly // Make box field read-only since it's calculated
        />
      </td>
      <td className="p-2 border">{product.CGST}%</td>
      <td className="p-2 border">{product.SGST}%</td>
      <td className="p-2 border">{product.HSN}</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>

            {/* Rest of the form fields... */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Mode</label>
              <select
                className="w-full border p-2 rounded"
                value={newPurchase.paymentMode}
                onChange={(e) => setNewPurchase({...newPurchase, paymentMode: e.target.value})}
              >
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {newPurchase.paymentMode === 'cash' ? 'Amount' : 
                 newPurchase.paymentMode === 'cheque' ? 'Cheque No.' : 
                 'Transaction ID'}
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={newPurchase.paymentRef}
                onChange={(e) => setNewPurchase({...newPurchase, paymentRef: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select
                className="w-full border p-2 rounded"
                value={newPurchase.paymentStatus}
                onChange={(e) => setNewPurchase({...newPurchase, paymentStatus: e.target.value})}
              >
                <option value="paid">Paid</option>
                <option value="unpaid">unpaid</option>
                <option value="half">Half Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Distributor</label>
              <select
                className="w-full border p-2 rounded"
                value={newPurchase.distributor}
                onChange={(e) => setNewPurchase({...newPurchase, distributor: e.target.value})}
                required
              >
                <option value="">Select Distributor</option>
                {distributors.filter(d => d !== 'All').map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date"
                className="w-full border p-2 rounded" 
                value={newPurchase.date} 
                onChange={(e) => setNewPurchase({...newPurchase, date: e.target.value})}
                required
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <button 
          className="px-4 py-2 rounded border hover:bg-gray-100 transition" 
          onClick={() => {
            resetPurchaseForm();
            setShowPurchaseForm(false);
          }}
        >
          Cancel
        </button>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" 
          onClick={handlePurchaseSubmit}
          disabled={newPurchase.products.length === 0 || loading}
        >
          {loading ? 'Adding...' : 'Add Purchase'}
        </button>
      </div>
    </div>
  </div>
)}
      {/* Payment Update Modal */}
      {paymentUpdate.id && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl mb-4 font-semibold">Update Sale Record</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.product}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shop</label>
                <input
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.shop}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.quantity}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Unit Price</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.price}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.amount}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <select
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.mode}
                  onChange={(e) => setPaymentUpdate({...paymentUpdate, mode: e.target.value})}
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {paymentUpdate.mode === 'cash' ? 'Amount' : 
                   paymentUpdate.mode === 'cheque' ? 'Cheque No.' : 
                   'Transaction ID'}
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.ref}
                  onChange={(e) => setPaymentUpdate({...paymentUpdate, ref: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.status}
                  onChange={(e) => setPaymentUpdate({...paymentUpdate, status: e.target.value})}
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={paymentUpdate.date}
                  onChange={(e) => setPaymentUpdate({...paymentUpdate, date: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
                onClick={resetPaymentUpdate}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handlePaymentUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {bulkUpdate.customer && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl mb-4 font-semibold">Bulk Update for {bulkUpdate.customer}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payment Mode</label>
              <select
                className="w-full border p-2 rounded"
                value={bulkUpdate.mode}
                onChange={(e) => setBulkUpdate({...bulkUpdate, mode: e.target.value})}
              >
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {bulkUpdate.mode === 'cash' ? 'Amount' : 
                 bulkUpdate.mode === 'cheque' ? 'Cheque No.' : 
                 'Transaction ID'}
              </label>
              <input
                type="Number"
                className="w-full border p-2 rounded"
                value={bulkUpdate.ref}
                onChange={(e) => setBulkUpdate({...bulkUpdate, ref: e.target.value})}
                min={1}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select
                className="w-full border p-2 rounded"
                value={bulkUpdate.status}
                onChange={(e) => setBulkUpdate({...bulkUpdate, status: e.target.value})}
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={bulkUpdate.date}
                onChange={(e) => setBulkUpdate({...bulkUpdate, date: e.target.value})}
              />
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Products in this order:</h4>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkUpdate.sales.map((sale, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{sale.product_name}</td>
                      <td className="p-2 border">{sale.quantity}</td>
                      <td className="p-2 border">₹{sale.price}</td>
                      <td className="p-2 border">₹{(sale.quantity * sale.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
                onClick={resetBulkUpdate}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleBulkPaymentUpdate}
            
              >
                update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <button 
    onClick={() => setShowChat(!showChat)}
    className="fixed bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all z-50"
  >
    {showChat ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
  </button>

  {/* Chat Interface */}
  {showChat && (
    <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">Support Chat</h3>
        <button 
          onClick={() => setShowChat(false)}
          className="text-white hover:text-gray-200"
        >
          <FaTimes size={16} />
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
              className={`mb-3 ${msg.sender === 'Accountant' ? 'text-right' : 'text-left'}`}
            >
              <div className={`inline-block p-2 rounded-lg ${msg.sender === 'Accountant' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.sender !== 'Accountant' && (
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
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-3 rounded hover:bg-green-700 flex items-center justify-center"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  )}
    </>
  );
};

export default Accountant;