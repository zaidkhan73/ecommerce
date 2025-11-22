import React from "react";
import { Search, PlusCircle, Edit2, Image, Menu, X, LayoutDashboard, Box, Layers, Bell } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 89.99,
      stock: 45,
      status: "Active",
      imageUrl: null,
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      category: "Wearables",
      price: 299.99,
      stock: 23,
      status: "Active",
      imageUrl: null,
    },
    {
      id: 3,
      name: "Laptop Stand",
      category: "Accessories",
      price: 45.5,
      stock: 8,
      status: "Active",
      imageUrl: null,
    },
    {
      id: 4,
      name: "USB-C Hub",
      category: "Accessories",
      price: 59.99,
      stock: 67,
      status: "Active",
      imageUrl: null,
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      category: "Electronics",
      price: 129.99,
      stock: 0,
      status: "Out of Stock",
      imageUrl: null,
    },
    {
      id: 6,
      name: "Gaming Mouse",
      category: "Electronics",
      price: 79.99,
      stock: 34,
      status: "Active",
      imageUrl: null,
    },
    {
      id: 7,
      name: "Desk Lamp",
      category: "Office",
      price: 39.99,
      stock: 0,
      status: "Inactive",
      imageUrl: null,
    },
    {
      id: 8,
      name: "Webcam HD",
      category: "Electronics",
      price: 89.99,
      stock: 56,
      status: "Active",
      imageUrl: null,
    },
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 bg-white shadow-md z-30 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Product
            </h1>
          </div>
        </div>
      </header>
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <button
  className="
    flex items-center gap-2 
    px-4 py-2 md:px-6 md:py-3 
    bg-gradient-to-r from-purple-600 to-blue-600 
    text-white rounded-lg 
    hover:shadow-lg transition-all duration-300 
    transform hover:scale-105 
    font-medium
    text-sm md:text-base
  "
>
  <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />

  {/* Mobile: "New", Desktop: "Add New Category" */}
  <span className="md:hidden">New</span>
  <span className="hidden md:inline">Add New Product</span>
</button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product List</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Card Content - Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm w-20">Image</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-500">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 px-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button className="font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200 text-left max-w-[200px] truncate block">
                              {product.name}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-gray-700 max-w-[150px] truncate">
                            {product.category}
                          </td>
                          <td className="py-4 px-4 text-gray-900 font-semibold">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {product.stock}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(product.status)}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-500 hover:text-purple-600 transition-all duration-200">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
