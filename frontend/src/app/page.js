import Image from "next/image";
import LINK from "next/link";
export default function Home() {
  return (
    <div >
          {/* <h1>Hello World</h1> */}
          <div>
            <button><LINK href= "./SignUp">SignUp</LINK></button>
          
          </div>
          <div>
           <button><LINK href= "./SignIn">SignIn</LINK></button>
          </div>
          <div className="w-full bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-stretch md:items-end gap-4 flex-wrap">
      {/* Search by Name */}
      <div className="flex flex-col w-full md:w-1/4">
        <label className="text-sm font-medium mb-1">Search by Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sort by Price */}
      <div className="flex flex-col w-full md:w-1/4">
        <label className="text-sm font-medium mb-1">Sort by Price</label>
        <select className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col w-full md:w-1/4">
        <label className="text-sm font-medium mb-1">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Apply Button */}
      <div className="w-full md:w-auto">
        <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mt-2 md:mt-6">
          Apply Filters
        </button>
      </div>
    </div>
  
    </div>
  );
}
