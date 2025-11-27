import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Package, LogOut, Grid } from 'lucide-react';
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { serverUrl } from '../App';



const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (item) => {
    console.log(`${item} clicked`);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls

    setIsLoggingOut(true);

    try {
      const res = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      // Navigate to signin page
      navigate("/login", { replace: true });

      console.log("Logged out successfully:", res);
    } catch (error) {
      console.log("Logout error:", error);
      alert("failed")
    } finally {
      setIsLoggingOut(false);
    }
  };

  // useEffect(()=>{
  //   const getCartCount = async () => {
  //     try {
  //       const res = await axios.get(`${serverUrl}/api/cart`, {
  //         withCredentials: true,
  //       });
  //       setCartCount(res.data.length);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getCartCount();
  // })

  return (
    <div className=" bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand */}
            <div 
              className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer select-none bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent"
              style={{ fontFamily: '"Playfair Display", serif' }}
              onClick={() => console.log('Home clicked')}
            >
              Agnishikha
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <button 
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => navigate("/cart")}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Menu Button with Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  onClick={toggleMenu}
                  aria-label="Menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <button 
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 text-left"
                      onClick={() => handleMenuItemClick('Categories')}
                    >
                      <Grid className="w-[18px] h-[18px] flex-shrink-0" />
                      Categories
                    </button>

                    <div className="h-px bg-gray-100 mx-2" />

                    <button 
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 text-left"
                      onClick={() => handleMenuItemClick('My Orders')}
                    >
                      <Package className="w-[18px] h-[18px] flex-shrink-0" />
                      My Orders
                    </button>

                    <div className="h-px bg-gray-100 mx-2" />

                    <button 
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 text-left"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;