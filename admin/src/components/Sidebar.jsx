import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Bell,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState();

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-white shadow-xl border-r border-purple-100 h-screen p-4 flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-8">
        

        <button
          className={`text-purple-600 transform transition-all duration-300 border-none
    ${open ? "translate-x-0" : "translate-x-3 translate-y-2"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Menu Items */}
      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
            transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`
          }
        >
          <LayoutDashboard size={20} />
          {open && "Dashboard"}
        </NavLink>

        {/* Products */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
            transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`
          }
        >
          <Package size={20} />
          {open && "Products"}
        </NavLink>

        {/* Categories */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
            transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`
          }
        >
          <Layers size={20} />
          {open && "Categories"}
        </NavLink>

        {/* Notifications */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer
            transition-all ${
              isActive
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`
          }
        >
          <Bell size={20} />
          {open && "Notifications"}
        </NavLink>
      </nav>
    </div>
  );
}

