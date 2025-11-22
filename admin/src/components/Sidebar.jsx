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
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation(); // 👉 current URL path

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Layers, label: "Categories", path: "/categories" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path; // 🔥 Auto Active

              return (
                <li key={index}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
