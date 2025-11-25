import React, { useState } from 'react';
import { BellRing, Menu, X, LayoutDashboard, Box, Layers, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Main Notifications Component
export default function Orders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [orders] = useState([
    {
      id: 'ORD001',
      customerName: 'Alice Smith',
      contactNumber: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      products: [
        { productId: 'PROD001', productName: 'Widget A', quantity: 2, pricePerUnit: 10.5 },
        { productId: 'PROD003', productName: 'Gadget C', quantity: 1, pricePerUnit: 25.0 },
      ],
      totalPrice: 46.0,
      status: 'Pending',
      orderDate: new Date('2025-07-30T10:00:00Z'),
    },
    {
      id: 'ORD002',
      customerName: 'Bob Johnson',
      contactNumber: '098-765-4321',
      address: '456 Oak Ave, Otherville, USA',
      products: [{ productId: 'PROD002', productName: 'Thing B', quantity: 5, pricePerUnit: 5.75 }],
      totalPrice: 28.75,
      status: 'Confirmed',
      orderDate: new Date('2025-07-29T14:30:00Z'),
    },
    {
      id: 'ORD003',
      customerName: 'Charlie Brown',
      contactNumber: '555-123-4567',
      address: '789 Pine Ln, Somewhere, USA',
      products: [
        { productId: 'PROD001', productName: 'Widget A', quantity: 1, pricePerUnit: 10.5 },
        { productId: 'PROD002', productName: 'Thing B', quantity: 3, pricePerUnit: 5.75 },
        { productId: 'PROD003', productName: 'Gadget C', quantity: 2, pricePerUnit: 25.0 },
      ],
      totalPrice: 87.75,
      status: 'Pending',
      orderDate: new Date('2025-07-31T09:15:00Z'),
    },
    {
      id: 'ORD004',
      customerName: 'Diana Prince',
      contactNumber: '444-555-6666',
      address: '321 Elm St, Paradise, USA',
      products: [
        { productId: 'PROD004', productName: 'Device D', quantity: 3, pricePerUnit: 15.0 },
      ],
      totalPrice: 45.0,
      status: 'Confirmed',
      orderDate: new Date('2025-07-28T16:45:00Z'),
    },
  ]);

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusStyle = (status) => {
    return status === 'Pending'
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-30">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Orders
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header with Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <BellRing className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Notifications</h2>
              <p className="text-gray-600">View and manage incoming customer orders.</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <p className="text-gray-600 text-sm mt-1">Click on an order to view full details and confirm.</p>
            </div>

            {/* Card Content - Table */}
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No new orders to display.</p>
                  <p className="text-sm mt-1">Check back later!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm w-32">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Total Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Order Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="border-b border-gray-100 hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="py-4 px-4">
                            <button className="font-medium text-gray-900 hover:text-purple-600 transition-colors duration-200">
                              {order.id}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-gray-900 hover:text-purple-600 transition-colors duration-200 text-left">
                              {order.customerName}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-gray-900 font-semibold hover:text-purple-600 transition-colors duration-200">
                              ${order.totalPrice.toFixed(2)}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-gray-700 hover:text-purple-600 transition-colors duration-200 text-left">
                              {formatDate(order.orderDate)}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <button className="inline-block">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                {order.status}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}