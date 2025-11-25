import React, { useEffect, useState } from "react";
import {
  Search,
  PlusCircle,
  Edit2,
  Image,
  Menu,
  X,
  LayoutDashboard,
  Box,
  Layers,
  Bell,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { AddCategoryDialog } from "../components/AddCategory";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

// Main Categories Component
export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/category/getAll-categories`,{withCredentials: true})
    console.log("getAllCategories: ",res.data.data)
    setCategories(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories();
    
  },[])


  const filteredCategories = categories.filter((category) => {
  const name = category.name || "";

  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );
});


  const getStatusStyle = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Categories
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
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
  onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />

              {/* Mobile: "New", Desktop: "Add New Category" */}
              <span className="md:hidden">New</span>
              <span className="hidden md:inline">Add New Category</span>
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Category List
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Products
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
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500"
                        >
                          No categories found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="py-4 px-4">
                            <button className="font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200 text-left max-w-[180px] truncate block">
                              {category.name}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-gray-700 max-w-[250px] truncate">
                            {category.category_description}
                          </td>
                          <td className="py-4 px-4 text-gray-900 font-semibold">
                            {category.productCount}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                category.isActive ? "Active" : "Inactive"
                              )}`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-500 hover:text-purple-600 transition-all duration-200"
                            onClick={() => navigate(`/categories/edit/${category._id}`)}>
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
      <AddCategoryDialog
        className="transition-all duration-300"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        // existingCategories={categories}
        // onAddCategory={handleAddCategory}
      />
    </div>
  );
}
