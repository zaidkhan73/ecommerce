import React, { useEffect, useRef } from "react";
import {
  Search,
  PlusCircle,
  Edit2,
  Image,
  Menu, Eye, MoreVertical,
  X,
  LayoutDashboard,
  Box,
  Layers,
  Bell,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef({});

   useEffect(() => {
  const handleClick = (e) => {
    const openRef = dropdownRef.current[openDropdown];
    if (openRef && !openRef.contains(e.target)) setOpenDropdown(null);
  };

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, [openDropdown]);


  const toggleDropdown = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };



  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
  switch (status) {
    case "in_stock":
      return "bg-green-100 text-green-700";
    case "out_of_stock":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/product/admin/getAll-product`, {
          withCredentials: true,
          
        });

        console.log("Fetched:", res.data.products);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

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
    text-sm md:text-base"
              onClick={() => navigate("/products/new")}
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Product List
              </h3>
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm w-20">
                        Image
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-8 text-gray-500"
                        >
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="py-4 px-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              {product.product_image && product.product_image.length > 0 ? (
  <img
    src={product.product_image[0].url}   // sirf first image dikha rahe hain list me
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
                            {product.product_category?.name}
                          </td>

                          <td className="py-4 px-4 text-gray-900 font-semibold">
                            ₹{product.final_price}
                          </td>

                          <td className="py-4 px-4 text-gray-700">
                            {product.inventory_quantity}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                product.status
                              )}`}
                            >
                              {product.status === "in_stock" ? "In Stock" : "Out of Stock"}

                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="py-4 px-4 text-right">
                            <div
                              className="relative inline-block"
                              ref={(el) => (dropdownRef.current[product._id] = el)}
                            >
                              <button
                                onClick={() => toggleDropdown(product._id)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                              </button>

                              {openDropdown === product._id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  <button
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>

                                  <button
                                    onClick={() => navigate(`/products/edit/${product._id}`)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
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
