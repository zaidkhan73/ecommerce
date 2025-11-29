import { useEffect, useState } from "react";
import Header from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { Search, Filter, ArrowUpDown, ShoppingCart, Menu, X, Package, LogOut, Grid } from 'lucide-react';
import axios from "axios"
import { serverUrl } from "../App";


const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cartCount, setCartCount] = useState("")
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
                             product.product_category?._id === selectedCategory ||
                             product.product_category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
  switch (sortBy) {
    case "price-low":
      return (a.final_price || a.product_price) - (b.final_price || b.product_price);

    case "price-high":
      return (b.final_price || b.product_price) - (a.final_price || a.product_price);

    case "name-asc":
      return a.name.localeCompare(b.name);

    case "discount": {
      const discountA = a.product_discount || 0;
      const discountB = b.product_discount || 0;
      return discountB - discountA;
    }

    case "newest":
    default:
      return 0;
  }
});



  useEffect(()=>{
    const fetchCartCount = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/cart`,{withCredentials:true})
        console.log("cart count:", res.data.cart.items.length)
        setCartCount(res.data.cart.items.length)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCartCount();
  },[])


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/product/getAll-product`, {
          withCredentials: true,
        });

        console.log("Fetched:", res.data.products);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);


  useEffect(()=>{
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/category/getAll-categories`,{withCredentials: true})
        console.log("getAllCategories: ",res.data.data)
        setCategories(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories();
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

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
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="all">All Categories</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative flex-1">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
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
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 
    grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
  {filteredAndSortedProducts.map((product) => (
    <div className="flex">
      <ProductCard key={product._id} product={product} />
    </div>
  ))}
</div>




        )}
      </main>
    </div>
  );
};

export default HomePage;