import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Package, LogOut, Grid, ChevronLeft, MapPin, CreditCard, Wallet, Percent } from 'lucide-react';
import axios from "axios";
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('online_payment');
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/cart`, {
          withCredentials: true,
        });
        console.log(res.data.cart);
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

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 59;
  const totalBeforeDiscount = subtotal + shipping;

  // Calculate payment amounts based on method
const getPaymentDetails = () => {
  if (paymentMethod === 'online_payment') {
    const discount = totalBeforeDiscount * 0.05;
    const finalAmount = totalBeforeDiscount - discount;
    return {
      onlineAmount: finalAmount,
      codAmount: 0,
      discount: discount,
      finalTotal: finalAmount,
      discountPercent: 5
    };
  } else if (paymentMethod === 'split_online_cod') {
    const onlineAmount = totalBeforeDiscount * 0.40;
    const codAmount = totalBeforeDiscount * 0.60;
    return {
      onlineAmount,
      codAmount,
      discount: 0,
      finalTotal: totalBeforeDiscount,
      discountPercent: 0
    };
  }
};


  const paymentDetails = getPaymentDetails();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    try {
      setLoading(true);

      const body = {
        payment_method: paymentMethod,
        total_amount: paymentDetails.finalTotal,
        online_amount: paymentDetails.onlineAmount,
        cod_amount: paymentDetails.codAmount,
        discount: paymentDetails.discount,
        address: address,
      };

      const res = await axios.post(`${serverUrl}/api/orders/create`, body, {
        withCredentials: true
      });
      
      const { message,
 order,
 razorpayOrder,
 key } = res.data;


      // If no razorpay order (shouldn't happen with our methods, but as fallback)
      if (!razorpayOrder) {
        alert("Order placed successfully!");
        setLoading(false);
        navigate('/orders');
        return;
      }

      // Load Razorpay SDK
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Razorpay SDK failed to load. Try again later.");
        setLoading(false);
        return;
      }

      const razorpayKey = key || process.env.REACT_APP_RAZORPAY_KEY;

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Agnishikha",
        description: `Payment for order ${order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await axios.post(`${serverUrl}/api/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, {
              withCredentials: true
            });
            console.log(verifyRes.data)

            alert("Payment successful and verified!");
            setLoading(false);
            navigate('/orders');
          } catch (err) {
            console.error("verification error:", err?.response?.data || err);
            alert("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          contact: "",
        },
        notes: {
          orderId: order._id,
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error("Payment failed:", resp.error);
        alert("Payment failed or was cancelled.");
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error("placeOrder error:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Order creation failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200 mb-3 sm:mb-4"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Back to Cart</span>
        </button>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add some products to checkout!</p>
            <button 
              className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-indigo-600 transition-all duration-200"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Order Items */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Items</h2>
              
              {/* Mobile - Horizontal Rows */}
              <div className="block sm:hidden space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">Qty: {item.quantity}</p>
                      <p className="text-sm sm:text-base font-bold text-purple-700">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet - Horizontal Cards */}
              <div className="hidden sm:flex overflow-x-auto gap-3 pb-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-36 sm:w-40 bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 bg-gray-100"
                    />
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">Qty: {item.quantity}</p>
                    <p className="text-sm sm:text-base font-bold text-purple-700">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Delivery Address</h2>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address including street, city, state, and pincode..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-xs sm:text-sm lg:text-base text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Method</h2>
              <div className="space-y-3">
                {/* Full Online Payment with 5% Discount */}
                <label className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  style={{
                    borderColor: paymentMethod === 'online_payment' ? '#7c3aed' : '#e5e7eb',
                    backgroundColor: paymentMethod === 'online_payment' ? '#faf5ff' : 'white'
                  }}>
                  <input
                    type="radio"
                    name="payment"
                    value="online_payment"
                    checked={paymentMethod === 'online_payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-purple-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Full Online Payment</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        5% OFF
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Pay full amount online and get 5% discount</p>
                    {paymentMethod === 'online_payment' && (
                      <div className="mt-2 pt-2 border-t border-purple-200">
                        <p className="text-xs sm:text-sm text-purple-700 font-medium">
                          Pay Now: ₹{paymentDetails.onlineAmount.toFixed(0)}
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* 40% Online + 60% COD */}
                <label className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  style={{
                    borderColor: paymentMethod === 'split_online_cod' ? '#7c3aed' : '#e5e7eb',
                    backgroundColor: paymentMethod === 'split_online_cod' ? '#faf5ff' : 'white'
                  }}>
                  <input
                    type="radio"
                    name="payment"
                    value="split_online_cod"
                    checked={paymentMethod === 'split_online_cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-purple-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">Partial Payment</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Pay 40% online, 60% on delivery</p>
                    {paymentMethod === 'split_online_cod' && (
                      <div className="mt-2 pt-2 border-t border-purple-200 space-y-1">
                        <p className="text-xs sm:text-sm text-purple-700 font-medium">
                          Pay Now (40%): ₹{paymentDetails.onlineAmount.toFixed(0)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Pay on Delivery (60%): ₹{paymentDetails.codAmount.toFixed(0)}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary & Place Order */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{shipping}</span>
                  )}
                </div>

                {paymentDetails.discount > 0 && (
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-green-600">Discount (5%)</span>
                    <span className="font-semibold text-green-600">-₹{paymentDetails.discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 sm:pt-3 flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700">
                    ₹{paymentDetails.finalTotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2.5 sm:py-3 lg:py-4 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-purple-700 hover:to-indigo-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    {paymentMethod === 'online_payment' ? (
                      <>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        Pay ₹{paymentDetails.onlineAmount.toFixed(0)} Now
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                        Pay ₹{paymentDetails.onlineAmount.toFixed(0)} Now
                      </>
                    )}
                  </>
                )}
              </button>

              <p className="text-xs sm:text-sm text-center text-gray-600 mt-3 sm:mt-4">
                {paymentMethod === 'split_online_cod' 
                  ? 'Get 5% discount by paying the full amount online'
                  : `no discount`}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;