import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Package, LogOut, Grid, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Durga Mata, Acrylic Figure',
      category: 'Acrylic God Figure',
      price: 130.00,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Decorative Wooden Gift Box',
      category: 'Home Decor',
      price: 250.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop'
    }
  ]);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200 mb-4"
        onClick={() => navigate("/")}>
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Continue Shopping</span>
        </button>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear Cart</span>
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-600 transition-all duration-200">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items - Left Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover bg-gray-100"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Qty: {item.quantity}</span>
                          <span className="mx-2">×</span>
                          <span>₹{item.price.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold text-purple-700">
                            Total: ₹{(item.price * item.quantity).toFixed(2)}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Items in Cart */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Items in your cart:
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 ml-2">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md mb-3">
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-center text-gray-600">
                    Payment will be collected on delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage