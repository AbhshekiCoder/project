"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { AwardIcon } from 'lucide-react';

const Accountant = () => {
  // Base URL for API calls
  const url = "http://localhost:5000/";
  
  // State for UI controls
  const [activeTab, setActiveTab] = useState('products');
  const [selectedDistributor, setSelectedDistributor] = useState('All');
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
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
    paymentRef: ''
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
    shop: '',
    sales: [],
    mode: 'cash',
    ref: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  });

  // Constants
  const distributors = ['All', 'Balaji', 'Namkeen', 'Colgate', 'Coahclate'];
  const paymentStatuses = ['pending', 'paid', 'half-paid', 'cancelled'];
  const paymentModes = ['cash', 'cheque', 'online', 'card', 'upi'];

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

  // Group sales by shop
  const groupSalesByShop = useCallback((salesData) => {
    const grouped = {};
    salesData.forEach(sale => {
      const shop = sale.salesMan || 'Unknown';
      if (!grouped[shop]) {
        grouped[shop] = [];
      }
      grouped[shop].push(sale);
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
    return groupSalesByShop(filteredSales);
  }, [filteredSales, groupSalesByShop]);
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
        }
        
         //Fetch purchases (sales with type=purchase)
        const purchasesResponse = await axios.get(`${url}purchase`);
        if (purchasesResponse.data.success) {
          setPurchases(purchasesResponse.data.data);
         
        }
        
        // Fetch sales (sales with type=sale)
        const salesResponse = await axios.get("http://localhost:5000/sales_fetch/sales_fetch");
        if (salesResponse.data.success) {
          setSales(salesResponse.data.data);
          console.log(salesResponse.data.data);
        }
        
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
    e.preventDefault();
    try {
      setLoading(true);
      
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        box: Number(newProduct.box) || 0,
        CGST: Number(newProduct.CGST) || 0,
        SGST: Number(newProduct.SGST) || 0,
        HSN: Number(newProduct.HSN) || 0
      };
      
      const endpoint = newProduct._id 
        ? `${url}inventory/update/${newProduct._id}`
        : `${url}inventory/inventory`;
        
      const method = newProduct._id ? 'put' : 'post';
      
      const response = await axios[method](endpoint, productData);
      
      if (response.data.success) {
        if (newProduct._id) {
          setProducts(products.map(p => 
            p._id === newProduct._id ? response.data.data : p
          ));
        } else {
          setProducts([...products, response.data.data]);
        }
        
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

  // Purchase form handlers
  const handlePurchaseSubmit = async () => {
    try {
      if (!newPurchase.products?.length) {
        setError('Please select at least one product');
        return;
      }
      setLoading(true);
      
      const purchaseData = {
        product_name: newPurchase.products.map(p => p.name).join(', '),
        product_id: newPurchase.products[0]?.id || '',
        price: newPurchase.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        quantity: newPurchase.products.reduce((sum, p) => sum + p.quantity, 0),
        payment: 'paid',
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
    
        
        // Refresh inventory after purchase
        const inventoryResponse = await axios.get(`${url}product/product`);
        if (inventoryResponse.data.success) {
          setProducts(inventoryResponse.data.data);
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
      paymentRef: ''
    });
  };

  // Payment update handlers
  const handlePaymentUpdate = async () => {
    try {
      setLoading(true);
      const sale = sales.find(s => s._id === paymentUpdate.id);
      if (!sale) return;

      const updateData = {
        payment: paymentUpdate.status,
        payment_type: paymentUpdate.mode,
        ref: paymentUpdate.ref,
        date: paymentUpdate.date
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
  const handleBulkPaymentUpdate = async () => {
    try {
      setLoading(true);
      const updates = bulkUpdate.sales.map(sale => ({
        id: sale._id,
        updates: {
          payment: bulkUpdate.status,
          payment_type: bulkUpdate.mode,
          ref: bulkUpdate.ref,
          date: bulkUpdate.date
        }
      }));
    
      const responses = await Promise.all(
        updates.map(update => 
         
          axios.put(`http://localhost:5000/sales/update/${update.id}`,{obj: update.updates})
          
        )
      );

      const salesResponse = await axios.get(`http://localhost:5000/sales_fetch/sales_fetch`);
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
      quantity: product.quantity || 1,
      box: product.box || 1,
      CGST: product.CGST || 0,
      SGST: product.SGST || 0,
      HSN: product.HSN || ''
    }));
    
    setNewPurchase(prev => ({
      ...prev,
      products: productsWithDetails,
      distributor: selectedProducts[0]?.distributor || ''
    }));
    console.log(productsWithDetails)
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
  const printShopBill = useCallback((shopName, shopSales) => {
    const billWindow = window.open('', '', 'width=800,height=600');
    const totalAmount = shopSales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
    
    billWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${shopName}</title>
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
            .shop-header { background-color: #f0f0f0; padding: 10px; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="bill-header">
            <div>
              <h2>Invoice Receipt</h2>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p>Invoice #: ${Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>
          
          <div class="bill-details">
            <div class="bill-row">
              <div class="bill-label">Shop:</div>
              <div>${shopName || 'N/A'}</div>
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
              ${shopSales.map(sale => `
                <tr>
                  <td>${sale.product_name || 'N/A'}</td>
                  <td>${sale.quantity || '0'}</td>
                  <td>₹${sale.price || '0'}</td>
                  <td>₹${(sale.quantity * sale.price).toFixed(2) || '0'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            Total Amount: ₹${totalAmount.toFixed(2)}
          </div>
          
          <div class="tax-details">
            <div class="bill-row">
              <div class="bill-label">Payment Mode:</div>
              <div>${shopSales[0]?.mode || 'N/A'}</div>
            </div>
            <div class="bill-row">
              <div class="bill-label">Payment Status:</div>
              <div>${shopSales[0]?.payment || 'N/A'}</div>
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

  // Print purchase bill
  const printPurchaseBill = useCallback((purchase) => {
    const billWindow = window.open('', '', 'width=600,height=800');
    const totalAmount = (purchase?.products || []).reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );

    billWindow.document.write(`
      <html>
        <head>
          <title>Purchase Bill - ${purchase.distributor}</title>
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
            .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .items-table th { background: #f0f0f0; text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
            .items-table td { padding: 8px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="bill-header">
            <div>
              <h2>Purchase Invoice</h2>
              <p>Date: ${new Date(purchase.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Invoice #: ${purchase._id}</p>
            </div>
          </div>
          
          <div class="bill-details">
            <div class="bill-row">
              <div class="bill-label">Distributor:</div>
              <div>${purchase.distributor}</div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${purchase.products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>₹${product.price}</td>
                  <td>₹${product.price * product.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="tax-details">
            <div class="bill-row">
              <div class="bill-label">Payment Mode:</div>
              <div>${purchase.paymentMode || 'Cash'}</div>
            </div>
            <div class="bill-row">
              <div class="bill-label">Payment Ref:</div>
              <div>${purchase.paymentRef || 'N/A'}</div>
            </div>
          </div>

          <div class="total">
            Grand Total: ₹${totalAmount}
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

  // Export to Excel
  const exportToExcel = useCallback((data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, []);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
       
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <input 
                    type="text" 
                    className="border p-2 rounded w-64" 
                    placeholder="Search products..." 
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                  <div className="flex space-x-2 items-center">
                    <input 
                      type="date" 
                      className="border p-2 rounded" 
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
                    />
                    <span>to</span>
                    <input 
                      type="date" 
                      className="border p-2 rounded" 
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
                    />
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
              <div className="overflow-x-auto">
                <table className="w-full border bg-white shadow rounded">
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
                          <td className="p-2 border">{product?.date ? new Date(product.date).toLocaleDateString() : 'N/A'}</td>
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  className="border p-2 rounded w-64" 
                  placeholder="Search purchases..." 
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div className="flex space-x-2 items-center">
                  <input 
                    type="date" 
                    className="border p-2 rounded" 
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
                  />
                  <span>to</span>
                  <input 
                    type="date" 
                    className="border p-2 rounded" 
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
                  />
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  className="border p-2 rounded w-64" 
                  placeholder="Search sales..." 
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
                <div className="flex space-x-2 items-center">
                  <input 
                    type="date" 
                    className="border p-2 rounded" 
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
                  />
                  <span>to</span>
                  <input 
                    type="date" 
                    className="border p-2 rounded" 
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
                  />
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
              {Object.entries(groupedSales).map(([shopName, shopSales]) => (
                <div key={shopName} className="mb-8">
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-t">
                    <h3 className="font-bold text-lg">{shopName}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => printShopBill(shopName, shopSales)}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                      >
                        Print All
                      </button>
                      <button
                        onClick={() => setBulkUpdate({
                          shop: shopName,
                          sales: shopSales,
                          mode: shopSales[0]?.mode,
                          ref: shopSales[0]?.ref || '',
                          status: shopSales[0]?.payment || 'pending',
                          date: shopSales[0]?.date || new Date().toISOString().split('T')[0],
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
                      {shopSales.map((sale) => (
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
                          <td className="p-2 border">{sale.distributorship}</td>
                          <td className="p-2 border">{sale.date}</td>
                          <td className="p-2 border">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setPaymentUpdate({
                                  id: sale._id,
                                  product: sale.product_name,
                                  shop: sale.salesMan,
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
                                onClick={() => printBill(sale)}
                                className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                              >
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-6 flex flex-col">
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
            className={`w-full text-left px-3 py-2 rounded transition ${activeTab === 'products' ? 'bg-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('products')}
          >
            All Products
          </button>
          <button 
            className={`w-full text-left px-3 py-2 rounded transition ${activeTab === 'purchases' ? 'bg-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('purchases')}
          >
            Purchases
          </button>
          <button 
            className={`w-full text-left px-3 py-2 rounded transition ${activeTab === 'sales' ? 'bg-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderTabContent()}
      </div>

      {/* Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl mb-4 font-semibold">
              {newProduct._id ? 'Edit Product' : 'Add Product'}
            </h3>
            
            <form onSubmit={handleProductSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input 
                    className="w-full border p-2 rounded" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.quantity} 
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      required
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SGST %</label>
                    <input 
                      type="number"
                      className="w-full border p-2 rounded" 
                      value={newProduct.SGST} 
                      onChange={(e) => setNewProduct({...newProduct, SGST: e.target.value})}
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
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  type="button"
                  className="px-4 py-2 rounded border hover:bg-gray-100 transition" 
                  onClick={() => {
                    resetProductForm();
                    setShowProductForm(false);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : newProduct._id ? 'Update' : 'Add'}
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
                <label className="block text-sm font-medium mb-1">Products</label>
                <select
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
                          <th className="p-2 border">Box</th>
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
                            <td className="p-2 border">{product.quantity}</td>
                            <td className="p-2 border">{product.box}</td>
                            <td className="p-2 border">{product.CGST}%</td>
                            <td className="p-2 border">{product.SGST}%</td>
                            <td className="p-2 border">{product.HSN}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

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
      {bulkUpdate.shop && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl mb-4 font-semibold">Bulk Update for {bulkUpdate.shop}</h3>
            
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
                type="text"
                className="w-full border p-2 rounded"
                value={bulkUpdate.ref}
                onChange={(e) => setBulkUpdate({...bulkUpdate, ref: e.target.value})}
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
  );
};

export default Accountant;