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
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";

export default function EditProductPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimum, setMinimum] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState([]);

  const [categories, setCategories] = useState([]);
  const { id } = useParams();

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    // Preview
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("product_description", description);
      formData.append("product_price", price);
      formData.append("product_discount", discount);
      formData.append("inventory_quantity", quantity);
      formData.append("minimum",minimum);
      formData.append("final_price", calculateDiscountedPrice());
      formData.append("product_category", selectedCategory);
      formData.append("status", status);

      if (images.length > 0) {
        images.forEach((img) => formData.append("product_image", img));
      }

      const res = await axios.put(
        `${serverUrl}/api/product/edit-product/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);

      alert("Product Updated Successfully!");
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert("Error updating product");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/product/delete-product/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setShowDeleteConfirm(false);
      navigate("/products");
    } catch (error) {
      console.log(error);
    }

    // navigate('/products');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/product/admin/get-product/${id}`,
          { withCredentials: true }
        );
        console.log("product info:", res.data.product);

        const p = res.data.product;

        setName(p.name);
        setDescription(p.product_description);
        setPrice(p.product_price);
        setDiscount(p.product_discount);
        setQuantity(p.inventory_quantity);
        setMinimum(p.minimum);
        setSelectedCategory(p.product_category?._id);
        setStatus(p.status);
        // Image preview
        if (Array.isArray(p.product_image)) {
          setImagePreview(p.product_image.map((img) => img.url));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

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
              Edit Product
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>

          {/* Product Form Card */}
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
              />
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
                Product Image{" "}
                {images.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    New images selected — old images will be replaced.
                  </p>
                )}
              </label>
              <div className="flex items-start gap-4">
                {imagePreview.length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {imagePreview.map((img, index) => (
                      <div
                        key={index}
                        className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors duration-200 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {images.length > 0
                        ? `${images.length} image(s) selected`
                        : "Click to upload images"}
                    </p>

                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
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
                />
              </div>

              {/* minimum piece required to purchase */}
              <div>
                <label
                  htmlFor="minimum"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  minimum purchase quantity
                </label>
                <input
                  type="number"
                  id="minimum"
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Product Category */}
            <div>
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete Product Button */}
            <button
              type="button"
              onClick={handleDeleteClick}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Trash2 className="w-5 h-5" />
              Delete Product
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        productName={name}
      />
    </div>
  );
}
