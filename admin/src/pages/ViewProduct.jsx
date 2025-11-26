import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Menu,
  Star,
  Package,
  DollarSign,
  Tag,
  Archive,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { serverUrl } from "../App";

export default function ViewProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [image, setImage] = useState([]);
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimum, setMinimum] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rating, setRating] = useState(0); // Product rating
  const [currentIndex, setCurrentIndex] = useState(0);

  const { id } = useParams();

  // Calculate star display based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="absolute w-5 h-5 text-gray-300" />
            <div className="absolute overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/product/get-product/${id}`,
          { withCredentials: true }
        );
        console.log("product info:", res.data.product);

        const p = res.data.product;

        setName(p.name);
        setDescription(p.product_description);
        setPrice(p.product_price);
        setDiscount(p.product_discount);
        setFinalPrice(p.final_price);
        setQuantity(p.inventory_quantity);
        setMinimum(p.minimum);
        setSelectedCategory(
          p.product_category?.name || p.product_category || "N/A"
        );
        setStatus(p.status);
        setRating(p.product_rating || 0); // Assuming rating comes from API

        if (Array.isArray(p.product_image)) {
          setImage(p.product_image.map((img) => img.url)); // array of URLs
        } else if (p.product_image?.url) {
          setImage([p.product_image.url]); // single image fallback
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="pt-24 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>

          {/* Product Image and Basic Info Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Product Image */}
              <div className="p-6 bg-gray-50 flex items-center justify-center relative">
                {image.length > 0 ? (
                  <>
                    <img
                      src={image[currentIndex]}
                      alt={name}
                      className="w-full h-64 sm:h-80 lg:h-96 object-contain rounded-lg"
                    />

                    {image.length > 1 && (
                      <>
                        {/* Left Button */}
                        <button
                          onClick={() =>
                            setCurrentIndex(
                              currentIndex === 0
                                ? image.length - 1
                                : currentIndex - 1
                            )
                          }
                          className="absolute left-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                        >
                          ‹
                        </button>

                        {/* Right Button */}
                        <button
                          onClick={() =>
                            setCurrentIndex((currentIndex + 1) % image.length)
                          }
                          className="absolute right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {rating.toFixed(1)} out of 5
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      status === "in_stock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status === "in_stock" ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Price Section */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  {discount > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">
                        Original Price:
                      </span>
                      <span className="text-lg line-through text-gray-500">
                        ₹{parseFloat(price).toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-600">Final Price:</span>
                    <span className="text-3xl font-bold text-purple-600">
                      ₹{parseFloat(finalPrice).toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Save ₹
                      {(parseFloat(price) - parseFloat(finalPrice)).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Archive className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Stock</p>
                      <p className="text-lg font-bold text-gray-900">
                        {quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Category</p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedCategory || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Product Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {description || "No description available."}
            </p>
          </div>

          {/* Product Specifications Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Product Name:
                </span>
                <span className="text-sm text-gray-900">{name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Category:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCategory || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Original Price:
                </span>
                <span className="text-sm text-gray-900">
                  ₹{parseFloat(price).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Discount:
                </span>
                <span className="text-sm text-gray-900">{discount}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Final Price:
                </span>
                <span className="text-sm font-bold text-purple-600">
                  ₹{parseFloat(finalPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Stock Quantity:
                </span>
                <span className="text-sm text-gray-900">{quantity} units</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  Status:
                </span>
                <span
                  className={`text-sm font-medium ${
                    status === "in_stock" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status === "in_stock" ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-700">
                  minimum purchase:
                </span>
                <span className="text-sm text-gray-900">{minimum} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
