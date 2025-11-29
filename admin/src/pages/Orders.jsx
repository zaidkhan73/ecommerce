import { BellRing, Menu, X, LayoutDashboard, Box, Layers, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import React, { useState, useEffect } from 'react';
import { serverUrl } from '../App';
import axios from "axios";
import { ChevronLeft, Package, MapPin, CreditCard, Wallet, Truck, CheckCircle, Clock, XCircle, Star, ChevronDown, ChevronUp, User, Phone, Mail, Send, Key } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/orders/admin`, {
          withCredentials: true,
        });
        console.log("fetched orders", res.data);
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'placed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'placed':
        return <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default:
        return <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? 'bg-green-50 text-green-700 border-green-200' 
      : 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const sendOTP = async () => {
    try {
      setLoadingOtp(true);
      const res = await axios.get(`${serverUrl}/api/orders/send-otp/${selectedOrder._id}`, {
        withCredentials: true
      });
      console.log(res.data)
      
      setOtpSent(true);
      alert('OTP sent to customer email successfully!');
      setLoadingOtp(false);
    } catch (error) {
      console.log(error);
      alert('Failed to send OTP. Please try again.');
      setLoadingOtp(false);
    }
  };

  const verifyOTP = async () => {
  try {
    setVerifyingOtp(true);

    const res = await axios.post(
      `${serverUrl}/api/orders/verify-otp`,
      { orderId: selectedOrder._id, otp: otpValue },
      { withCredentials: true }
    );

    alert(res.data.message);

    // ← Order status frontend state updated
    setSelectedOrder({
      ...selectedOrder,
      order_status: "delivered",
    });

    setOtpSent(false);
    setOtpValue("");
    setVerifyingOtp(false);

  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "OTP Verification failed!");
    setVerifyingOtp(false);
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Order Management
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 sm:pt-20 lg:pt-24 p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Left Side - Order List */}
            <div className="lg:col-span-1 space-y-3 sm:space-y-4">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  All Orders ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base font-medium">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {orders.map((order) => (
                      <button
                        key={order._id}
                        onClick={() => {
                          setSelectedOrder(order);
                          setOtpSent(false);
                          setOtpValue('');
                        }}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedOrder?._id === order._id
                            ? 'border-purple-500 bg-purple-50 shadow-sm'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                              #{order._id?.slice(-8)}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                            {getStatusIcon(order.order_status)}
                            <span className="hidden sm:inline capitalize">{order.order_status}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {order.items?.length || 0} items
                          </span>
                          <span className="text-sm sm:text-base font-bold text-purple-700">
                            ₹{order.total_amount?.toFixed(0)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Order Details */}
            <div className="lg:col-span-2">
              {!selectedOrder ? (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Select an order to view details
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Click on any order from the list to see full information
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Order Header */}
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                          Order #{selectedOrder._id?.slice(-8)}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                          Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border capitalize ${getStatusColor(selectedOrder.order_status)}`}>
                          {getStatusIcon(selectedOrder.order_status)}
                          {selectedOrder.order_status}
                        </span>
                        <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                          {selectedOrder.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Update Status with OTP Verification */}
                    <div className="pt-3 border-t border-gray-100">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Order Status
                      </label>

                      {selectedOrder.order_status === 'placed' ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-800 mb-2">
                              To mark this order as <span className="font-semibold">Delivered</span>, you need to verify with an OTP sent to the customer's email.
                            </p>
                            
                            {!otpSent ? (
                              <button
                                onClick={sendOTP}
                                disabled={loadingOtp}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                                {loadingOtp ? 'Sending OTP...' : 'Send OTP to Customer'}
                              </button>
                            ) : (
                              <div className="space-y-2">
                                <div className="relative">
                                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    value={otpValue}
                                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                  onClick={verifyOTP}
                                    disabled={verifyingOtp || otpValue.length !== 6}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    {verifyingOtp ? 'Verifying...' : 'Verify & Mark Delivered'}
                                  </button>
                                  
                                  <button
                                    onClick={sendOTP}
                                    disabled={loadingOtp}
                                    className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                                  >
                                    Resend
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-semibold text-green-800">
                              This order has been delivered successfully!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                      Order Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                              {item.product_name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>₹{item.price?.toFixed(0)} each</span>
                            </div>
                            <p className="text-sm sm:text-base font-bold text-purple-700 mt-1">
                              Total: ₹{(item.price * item.quantity)?.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Delivery Info */}
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                      Customer & Delivery
                    </h3>

                    {/* Delivery Address */}
                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                          Delivery Address
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 pl-6 sm:pl-7">
                        {selectedOrder.address}
                      </p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-5">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Payment Summary
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-900">
                          {selectedOrder.payment_method === 'full_online' 
                            ? 'Full Online Payment' 
                            : 'Partial Payment (40% + 60% COD)'}
                        </span>
                      </div>

                      {selectedOrder.online_amount > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Online Amount:</span>
                          <span className="font-semibold text-gray-900">
                            ₹{selectedOrder.online_amount?.toFixed(0)}
                          </span>
                        </div>
                      )}

                      {selectedOrder.cod_amount > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">COD Amount:</span>
                          <span className="font-semibold text-gray-900">
                            ₹{selectedOrder.cod_amount?.toFixed(0)}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm sm:text-base font-bold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-purple-700">
                          ₹{selectedOrder.total_amount?.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}