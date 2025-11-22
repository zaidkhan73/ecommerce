import React from "react";
import {
  Package,
  Grid,
  Clock,
  TrendingUp,
  Plus,
  Settings,
  MoreVertical,
  Menu,
  X,
  LayoutDashboard,
  Box,
  Layers,
  Bell,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products] = useState([
    { id: 1, name: "Wireless Headphones", price: "$89.99", status: "Active" },
    { id: 2, name: "Smart Watch Pro", price: "$299.99", status: "Active" },
    { id: 3, name: "Laptop Stand", price: "$45.50", status: "Low Stock" },
    { id: 4, name: "USB-C Hub", price: "$59.99", status: "Active" },
    {
      id: 5,
      name: "Mechanical Keyboard",
      price: "$129.99",
      status: "Out of Stock",
    },
  ]);

  const stats = [
    {
      title: "Total Products",
      value: "248",
      icon: Package,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Product Categories",
      value: "12",
      icon: Grid,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Orders",
      value: "34",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Sales Analytics",
      value: "$12.5k",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
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
              Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                <Plus className="w-5 h-5" />
                Add Product
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                <Grid className="w-5 h-5" />
                Add Category
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                onClick={() => {
                  navigate("/products");
                }}
              >
                <Settings className="w-5 h-5" />
                Manage Products
              </button>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Products
              </h2>
              <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors duration-200">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200
                 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Left: Name */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                  </div>

                  {/* Right: Price + Status + Action */}
                  <div
                    className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6
                   w-full sm:w-auto"
                  >
                    <span className="font-bold text-gray-800 min-w-[70px] text-sm sm:text-base">
                      {product.price}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium min-w-[90px] text-center ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>

                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
