import React from 'react'

export default function page() {
    return (
        <div className='h-screen bg-purple-100' style={{paddingTop:"69px"}}>

            {/* Filter */}
            <div className=" bg-purple-100 border border-purple-300 rounded-md m-3 pt-1.5 pb-4 pl-5  gap-4 flex-wrap" style={{boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"}}>
                {/* Search Products bt Filter */}
                <div className='text-purple-500 font-serif text-center text-5xl mb-8 mt-6'>
                    <h1>Search Products by Filter</h1>
                </div>
                {/* Search by Name */}
                <div className='flex flex-col md:flex-row mb-4 justify-center gap-4 flex-wrap items-stretch md:items-end'>
                    <div className="flex flex-col w-full md:w-1/4 text-gray-800">
                      <label className="text-sm font-medium mb-1.5 ml-1">Search by Name</label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        className="Salesman-Inputs border-2 border-purple-700 outline-none px-3 py-2 max-w-96 rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Sort by Price */}
                    <div className="flex flex-col w-full md:w-1/4">
                      <label className="text-sm font-medium mb-1.5 ml-1 text-gray-800">Sort by Price</label>
                      <select className="px-3 py-2 max-w-96 Salesman-Inputs border-2 border-purple-700 outline-none rounded-lg shadow-sm focus:outline-none">
                        <option value="">Select</option>
                        <option value="low">Low to High</option>
                        <option value="high">High to Low</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col w-full md:w-1/4">
                        <label className="text-sm font-medium mb-1.5 ml-1 text-gray-700">Price Range</label>
                        <div className="flex gap-2">
                            <input type="number" placeholder="Min"
                                className="Salesman-Inputs w-1/2 px-3 py-2 border-2 border-purple-700 outline-none rounded-lg shadow-sm focus:outline-none "/>
                            <input type="number" placeholder="Max"
                                className="Salesman-Inputs w-1/2 px-3 py-2 border-2 border-purple-700 outline-none rounded-lg shadow-sm focus:outline-none "/>
                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="w-full md:w-auto ">
                        <button className="Salesman-Button cursor-pointer w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mt-2 md:mt-6">
                            Apply Filters
                        </button>
                    </div>
                </div>

            </div>

            <div className='h-96 bg-amber-100 border-2 rounded-md m-3 pt-1.5 pb-4 pl-5'>
                <h1>This content will be for salesman</h1>
            </div>
        </div>
    )
}
