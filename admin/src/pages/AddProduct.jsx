import React, { useState } from "react";
import {
  ArrowLeft,
  Menu,
  X,
  Upload,
  LayoutDashboard,
  Box,
  Layers,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("in_stock");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]); // list of categories
  const [selectedCategory, setSelectedCategory] = useState(""); // selected category

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (price && discount) {
      const originalPrice = parseFloat(price);
      const discountPercent = parseFloat(discount);
      const discountedPrice =
        originalPrice - (originalPrice * discountPercent) / 100;
      return discountedPrice.toFixed(2);
    }
    return price;
  };

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      description.trim() !== "" &&
      price !== "" &&
      quantity !== "" &&
      selectedCategory !== "" &&
      image.length > 0
    );
  };

  const handleImageChange = (e) => {
    // if (file) {
    //   setImage(file);
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImagePreview(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
    const files = Array.from(e.target.files);
    setImage(files);
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message

    const formData = new FormData();
    formData.append("name", name);
    formData.append("product_description", description);
    formData.append("product_price", price);
    formData.append("product_discount", discount);
    formData.append("inventory_quantity", quantity);
    formData.append("product_category", selectedCategory);
    formData.append("status", status);
    formData.append("final_price", calculateDiscountedPrice());

    if (image) {
      image.forEach((img) => {
        formData.append("product_image", img);
      });
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/product/add-product`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(res.data);
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.log(error);

      // Backend ka message show karne ke liye
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error adding product");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/category/getAll-categories`,
          { withCredentials: true }
        );
        console.log("product Categories: ", res.data.data);
        setCategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

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
              Add New Product
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => {
              navigate("/products");
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>

          {/* Product Form Card */}
          <form action="">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">
                Product Information
              </h2>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter product name"
                  required
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm font-medium text-center">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Product Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Price and Discount Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Product Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                {/* Product Discount */}
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              {/* Final Price Display */}
              {discount && price && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">
                    Original Price:{" "}
                    <span className="line-through">
                      ₹{parseFloat(price).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    Final Price: ₹{calculateDiscountedPrice()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Save ₹
                    {(
                      parseFloat(price) - parseFloat(calculateDiscountedPrice())
                    ).toFixed(2)}{" "}
                    ({discount}% off)
                  </p>
                </div>
              )}

              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>

                <div className="flex items-center gap-6">
                  <div className="flex gap-4 flex-wrap">
                    {imagePreview?.map((src, index) => (
                      <div
                        key={index}
                        className="w-40 h-40 overflow-hidden rounded-xl border-2 border-gray-300"
                      >
                        <img src={src} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <label className="flex-1 cursor-pointer">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6
      hover:border-purple-500 transition-colors duration-200 text-center"
                    >
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />

                      <p className="text-sm text-gray-600 mb-1">
                        {image.length > 0
                          ? image.map((i) => i.name).join(", ")
                          : "Click to upload image"}
                      </p>

                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Status and Quantity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Product Status *
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                {/* Inventory Quantity */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Inventory Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Product Category */}
              <div className="w-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Product Category *
                </label>

                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="
      w-full px-4 py-3 rounded-lg border border-gray-300 
      focus:outline-none focus:ring-2 focus:ring-purple-500
      bg-white text-gray-800 cursor-pointer
      appearance-none 
    "
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='gray'%3E%3Cpath d='M5 7l5 5 5-5'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="" className="">
                    Select a category
                  </option>

                  {categories?.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="py-2 text-gray-700"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 w-full">
                <div className="flex gap-3">
                  {loading ? (
                    // Show loading button
                    <button
                      type="button"
                      disabled
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 
      flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </button>
                  ) : (
                    // Normal buttons
                    <>
                      <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className={`
          flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 
          ${
            isFormValid()
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
                      >
                        Add Product
                      </button>
                    </>
                  )}
                </div>

                {!isFormValid() && (
                  <p className="text-red-500 text-sm font-medium text-center">
                    Fill all fields to add product
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
