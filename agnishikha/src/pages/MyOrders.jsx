import React, { useState, useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Wallet,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ratingModal, setRatingModal] = useState({
    show: false,
    orderId: null,
    productId: null,
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/orders/user`, {
          withCredentials: true,
        });
        console.log(res.data.orders);
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
  if (status === "paid") {
    return "bg-green-50 text-green-700 border-green-200";
  } 
  else if (status === "partial_paid") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  } 
  else {
    return "bg-red-50 text-red-700 border-red-200";
  }
};


  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRateProduct = (orderId, productId) => {
    setRatingModal({ show: true, orderId, productId });
    setSelectedRating(0);
    setHoverRating(0);
  };

  const submitRating = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/orders/rate`,
        {
          productId: ratingModal.productId,
          rating: selectedRating,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);

      alert("Rating submitted successfully!");
      setRatingModal({ show: false, orderId: null, productId: null });
      setSelectedRating(0);
      setError("");
    } catch (error) {
      console.log(error);

      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            My Orders
          </h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <button
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">
            Back to Products
          </span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Start shopping to see your orders here!
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-indigo-600 transition-all duration-200">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-3 sm:p-4 lg:p-5 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          Order #{order._id?.slice(-8)}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Order Status */}
                      {(order.payment_status === "paid" || order.payment_status === "partial_paid") && (
  <span
    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border ${getStatusColor(
      order.order_status
    )}`}
  >
    {getStatusIcon(order.order_status)}
    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
  </span>
)}


                      {/* Payment Status */}
                      <span
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {
  order.payment_status === "paid"
    ? "Paid"
    : order.payment_status === "partial_paid"
    ? "40% Paid"
    : "Cancelled"
}

                      </span>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Amount:
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-purple-700">
                      ₹{order.total_amount?.toFixed(0)}
                    </span>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleOrderExpansion(order._id)}
                    className="w-full mt-3 flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm transition-colors duration-200"
                  >
                    {expandedOrder === order._id ? (
                      <>
                        Hide Details <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 bg-gray-50">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 flex gap-2 sm:gap-3"
                          >
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">
                                {item.product_name}
                              </h5>
                              <p className="text-xs text-gray-600 mb-1">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm sm:text-base font-bold text-purple-700">
                                ₹{item.price?.toFixed(0)}
                              </p>
                            </div>

                            {/* Rate Product Button */}
                            {order.order_status === "delivered" && (
                              <button
                                onClick={() =>
                                  handleRateProduct(order._id, item.product_id)
                                }
                                className="flex-shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-indigo-600 transition-all duration-200"
                              >
                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                Rate
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                          Delivery Address
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 pl-6 sm:pl-7">
                        {order.address}
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                          Payment Details
                        </h4>
                      </div>

                      <div className="space-y-2 pl-6 sm:pl-7">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Method:
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {order.payment_method === "online_payment"
                              ? "Full Online Payment"
                              : "Partial Payment (40% Online + 60% COD)"}
                          </span>
                        </div>

                        {order.online_amount > 0 && (
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600">
                              Online Amount:
                            </span>
                            <span className="font-semibold text-gray-900">
                              ₹{order.online_amount?.toFixed(0)}
                            </span>
                          </div>
                        )}

                        {order.cod_amount > 0 && (
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600">COD Amount:</span>
                            <span className="font-semibold text-gray-900">
                              ₹{order.cod_amount?.toFixed(0)}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm sm:text-base font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="text-base sm:text-lg font-bold text-purple-700">
                            ₹{order.total_amount?.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {ratingModal.show && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
              Rate this Product
            </h3>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= (hoverRating || selectedRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-center text-sm mb-2">{error}</p>
            )}

            {selectedRating > 0 && (
              <p className="text-center text-sm text-gray-600 mb-4">
                You rated: {selectedRating} out of 5 stars
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRatingModal({
                    show: false,
                    orderId: null,
                    productId: null,
                  });
                  setSelectedRating(0);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={selectedRating === 0}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
