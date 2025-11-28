import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Package, LogOut, Grid, ChevronLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([]);

  const clearCart = async() => {
    try {
        const res = await axios.delete(`${serverUrl}/api/cart/clear`, {withCredentials:true})
        console.log(res.data)
        setCartItems([]); 
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/cart`, {
          withCredentials: true,
        });
        console.log(res.data.cart)
        const cartData = res.data.cart;
        if (!cartData || !cartData.items) {
          setCartItems([]);
          return;
        }
        const formattedCart = res.data.cart.items.map(item => ({
          product_id: item.product_id._id,
          id: item._id,
          name: item.product_id.name,
          price: item.product_id.final_price,
          image: item.product_id.product_image?.[0]?.url,
          quantity: item.quantity,
          inventory_quantity: item.product_id.inventory_quantity,
        }));
        setCartItems(formattedCart);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCartItem();
  }, []);

  const deleteCartItem = async (product_id) => {
    try {
      const res = await axios.delete(`${serverUrl}/api/cart/delete`, {
        withCredentials: true,
        data: { product_id },
      });

      setCartItems(prev => prev.filter(item => item.product_id !== product_id));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartQuantity = async (product_id, newQuantity) => {
    try {
      const res = await axios.put(`${serverUrl}/api/cart/update`, {
        product_id,
        quantity: newQuantity
      }, {
        withCredentials: true,
      });

      setCartItems(prev => 
        prev.map(item => 
          item.product_id === product_id 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (product_id, action, currentQuantity, inventoryQuantity) => {
    let newQuantity = currentQuantity;
    
    if (action === 'increase' && currentQuantity < inventoryQuantity) {
      newQuantity = currentQuantity + 1;
    } else if (action === 'decrease' && currentQuantity > 1) {
      newQuantity = currentQuantity - 1;
    }
    
    if (newQuantity !== currentQuantity) {
      updateCartQuantity(product_id, newQuantity);
    }
  };

  

  useEffect(() => {
    console.log("Updated Cart Items:", cartItems);
  }, [cartItems]);



  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 59;
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Back Button */}
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-gray-600 hover:text-purple-700 transition-colors duration-200 mb-3 sm:mb-4">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Continue Shopping</span>
        </button>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button 
              onClick={clearCart}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Clear Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add some products to get started!</p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-indigo-600 transition-all duration-200"
            onClick={()=>navigate("/")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cart Items - Left Section */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div 
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover bg-gray-100"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => navigate(`/product/${item.product_id}`)}
                        >
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            ₹{item.price.toFixed(0)} each
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCartItem(item.product_id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-all duration-200 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0 mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.product_id, 'decrease', item.quantity, item.inventory_quantity);
                              }}
                              disabled={item.quantity <= 1}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
                            </button>
                            <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 min-w-[40px] sm:min-w-[48px] text-center border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.product_id, 'increase', item.quantity, item.inventory_quantity);
                              }}
                              disabled={item.quantity >= item.inventory_quantity}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
                            </button>
                          </div>
                          {item.quantity >= item.inventory_quantity && (
                            <span className="text-xs text-red-600 font-medium">Max</span>
                          )}
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <div className="text-base sm:text-lg lg:text-xl font-bold text-purple-700">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 lg:sticky lg:top-20">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                {/* Items in Cart */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">
                    Items in your cart:
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-xs sm:text-sm">
                        <div className="flex-1 pr-2">
                          <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ₹{item.price.toFixed(0)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toFixed(0)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-start text-xs sm:text-sm">
                    <div className="flex-1">
                      <span className="text-gray-600">Shipping</span>
                      {subtotal < 999 && (
                        <p className="text-xs text-gray-500">(free above ₹999)</p>
                      )}
                    </div>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹{shipping}</span>
                    )}
                  </div>

                  {/* Free Shipping Message */}
                  {subtotal < 999 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 sm:p-3">
                      <p className="text-xs text-purple-700 font-medium">
                        Add ₹{(999 - subtotal).toFixed(0)} more for FREE delivery!
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 mt-3 sm:mt-4 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      ₹{total.toFixed(0)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;