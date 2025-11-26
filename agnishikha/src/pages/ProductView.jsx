import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  Star,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const ProductViewPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState([]);

  const product = {
    name: "Decorative Wooden Gift Box",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565183928294-7d22f2d45ed6?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=800&fit=crop",
    ],
    rating: 4,
    totalReviews: 128,
    price: 250.0,
    minPieces: 6,
    description:
      "This elegant wooden MDF decorative gift box is crafted with intricate detailing and a timeless design. The box features a beautifully carved lattice pattern on the lid with a transparent backing, giving it a classy and artistic appeal. The outer edges are adorned with a geometric border design, enhancing its traditional yet modern look. Made from high-quality MDF wood with a smooth polished finish, it is both sturdy and stylish. The secure hinged lid opens to reveal a spacious interior, perfect for storing jewelry, keepsakes, or other precious items. Its antique-style craftsmanship makes it an ideal choice for gifting, home décor, or personal use.",
    specifications: {
      material: "wooden",
      size: "6.25 X 4 X 2.5",
      weight: "none",
    },
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setSelectedQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const totalPrice = (finalPrice.toFixed(0) * selectedQuantity).toFixed(2);

  const StarRating = ({ rating, totalStars = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}.0)</span>
      </div>
    );
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div
              className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer select-none bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Agnishikha
            </div>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200"
          onClick={() => navigate("/home")}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Products</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden aspect-square">
              <img
                src={image[selectedImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {image.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all duration-200 w-14 h-14 flex-shrink-0 ${
                    selectedImage === index
                      ? "border-purple-600 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <StarRating rating={rating} />
                <span className="text-sm text-gray-500">
                  {rating} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-purple-700">
                ₹{finalPrice.toFixed(0)}
              </span>
              <span className="text-sm text-gray-600">per piece</span>
            </div>

            {/* Minimum Pieces */}
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg w-fit">
              <Package className="w-4 h-4 text-purple-700" />
              <span className="text-sm font-medium text-purple-700">
                Minimum {minimum} pcs
              </span>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <input
                    type="text"
                    value={selectedQuantity}
                    readOnly
                    className="w-16 text-center font-semibold text-gray-900 bg-white border-x-2 border-gray-200 py-3"
                  />
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                    disabled={selectedQuantity >= quantity}
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Total Price:</span>
                <span className="text-3xl font-bold text-purple-700">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Price per Item: ₹{finalPrice.toFixed(0)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
  {/* Minimum quantity warning */}
  {selectedQuantity < minimum && (
    <p className="text-red-600 text-sm font-medium">
      Purchase available for minimum {minimum} pieces
    </p>
  )}

  <div className="flex flex-col sm:flex-row gap-3">
    <button
      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5 active:translate-y-0 shadow-md"
      disabled={selectedQuantity < minimum}
    >
      <ShoppingCart className="w-5 h-5" />
      Add To Cart
    </button>

    <button
      className="flex-1 flex items-center justify-center gap-2 bg-white text-purple-700 py-3 sm:py-4 px-6 rounded-lg font-semibold border-2 border-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:translate-y-0 hover:bg-purple-50 hover:-translate-y-0.5 active:translate-y-0"
      disabled={selectedQuantity < minimum}
    >
      <Package className="w-5 h-5" />
      Book Now
    </button>
  </div>
</div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductViewPage;
