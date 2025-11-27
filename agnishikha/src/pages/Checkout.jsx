import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Package, LogOut, Grid, ChevronLeft, MapPin, CreditCard, Wallet } from 'lucide-react';



const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');

  const orderItems = [
    {
      id: 1,
      name: 'Durga Mata, Acrylic Figure',
      price: 390.00,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Decorative Wooden Gift Box',
      price: 250.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Wireless Gaming Mouse',
      price: 2499.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop'
    }
  ];

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }
    console.log('Order placed with:', { paymentMethod, address, orderItems, totalPrice });
    alert(`Order placed successfully! Payment method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
    

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Cart</span>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          
          {/* Mobile - Horizontal Rows */}
          <div className="block sm:hidden space-y-3">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-purple-700">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet - Horizontal Cards */}
          <div className="hidden sm:flex overflow-x-auto gap-3 pb-2">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-40 bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded-lg mb-2 bg-gray-100"
                />
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-base font-bold text-purple-700">
                  ₹{item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-purple-700" />
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address including street, city, state, and pincode..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            {/* Cash on Delivery */}
            <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
              style={{
                borderColor: paymentMethod === 'cod' ? '#7c3aed' : '#e5e7eb',
                backgroundColor: paymentMethod === 'cod' ? '#faf5ff' : 'white'
              }}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 accent-purple-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 text-purple-700" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Cash on Delivery</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Pay when you receive the order</p>
              </div>
            </label>

            {/* Online Payment */}
            <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
              style={{
                borderColor: paymentMethod === 'online' ? '#7c3aed' : '#e5e7eb',
                backgroundColor: paymentMethod === 'online' ? '#faf5ff' : 'white'
              }}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 accent-purple-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-purple-700" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Online Payment</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Pay via UPI, Card, or Net Banking</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary & Place Order */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl sm:text-3xl font-bold text-purple-700">₹{totalPrice.toFixed(2)}</span>
          </div>

          {/* Conditional Place Order Buttons */}
          {paymentMethod === 'cod' ? (
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 sm:py-4 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-green-700 hover:to-green-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Place Order (Cash on Delivery)
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 sm:py-4 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-blue-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          )}

          <p className="text-xs sm:text-sm text-center text-gray-600 mt-4">
            {paymentMethod === 'cod' 
              ? 'Your order will be confirmed and payment will be collected on delivery'
              : 'You will be redirected to the payment gateway to complete your purchase'}
          </p>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;