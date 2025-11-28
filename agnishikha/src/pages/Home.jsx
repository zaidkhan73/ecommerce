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

  const filteredAndSortedProducts = products
  .filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "name-asc":
        return a.name.localeCompare(b.name);

      case "discount":
        return (b.old_price - b.price) - (a.old_price - a.price);

      default:
        return 0; // newest first (no sorting change)
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
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
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
        <div className="flex justify-center w-full">
  <div className="mx-auto grid gap-6
     grid-cols-[repeat(auto-fit,minmax(220px,250px))] 
     justify-center"
       style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 250px))" }}>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</div>

      </main>
    </div>
  );
};

export default HomePage;