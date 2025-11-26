import { useState } from "react";
import Header from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { Search, Filter, ArrowUpDown, ShoppingCart, Menu, X, Package, LogOut, Grid } from 'lucide-react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');


  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium sound quality with active noise cancellation and 30-hour battery life',
      price: 2999,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your health and fitness with heart rate monitor and GPS',
      price: 4999,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
    },
    {
      id: 3,
      name: 'Portable Power Bank',
      description: '20000mAh high capacity fast charging power bank with dual USB ports',
      price: 1499,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'
    },
    {
      id: 4,
      name: 'Laptop Backpack',
      description: 'Water-resistant backpack with multiple compartments and USB charging port',
      price: 1899,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      description: 'High precision RGB gaming mouse with customizable buttons',
      price: 2499,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'
    },
    {
      id: 6,
      name: 'USB-C Hub Adapter',
      description: '7-in-1 multiport adapter with HDMI, USB 3.0, and SD card reader',
      price: 1299,
      discount: 35,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'
    },
    {
      id: 7,
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches for gaming',
      price: 3499,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop'
    },
    {
      id: 8,
      name: 'Webcam HD 1080p',
      description: 'Full HD webcam with auto-focus and built-in microphone',
      price: 2199,
      discount: 22,
      image: 'https://images.unsplash.com/photo-1585509512330-7f0c1a05ffc3?w=500&h=500&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search and Filters Section */}
        <div className="mb-6 sm:mb-8">
          {/* Search Bar - Full Width on all screens */}
          <div className="relative mb-3 sm:mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filters Row - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative flex-1">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;