import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  Star,
  Plus,
  Minus,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const StarRating = ({ rating, totalStars = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          ({rating}.0)
        </span>
      </div>
    );
  };

const ProductViewPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState([]);
  const [productId, setProductId] = useState("");
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  const checkIfInCart = async (productId) => {
    try {
      const res = await axios.get(`${serverUrl}/api/cart`, {
        withCredentials: true,
      });

      const cartItem = res.data.cart?.items?.find(
        (item) => item.product_id?._id === productId
      );

      if (cartItem) {
        setAlreadyInCart(true);
        console.log("111111");
      }
    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && selectedQuantity < quantity) {
      setSelectedQuantity((prev) => prev + 1);
    } else if (action === "decrease" && selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const totalPrice = (finalPrice * selectedQuantity).toFixed(0);

  

  const addToCart = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/cart/add`,
        { product_id: productId, quantity: selectedQuantity },
        { withCredentials: true }
      );
      console.log(res.data);
      setAlreadyInCart(true);
    } catch (error) {
      console.log(error);
    }
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
        setFinalPrice(Number(p.final_price));
        setQuantity(p.inventory_quantity);
        setMinimum(p.minimum);
        setProductId(p._id);
       
        setRating(p.product_rating || 0);

        if (Array.isArray(p.product_image)) {
          setImage(p.product_image.map((img) => img.url));
        } else if (p.product_image?.url) {
          setImage([p.product_image.url]);
        }

        await checkIfInCart(p._id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

  // Check if description is long (more than 200 characters)
  const isLongDescription = description.length > 200;
  const displayDescription = showFullDescription
    ? description
    : description.slice(0, 200);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            <div
              className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight cursor-pointer select-none bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent"
              style={{ fontFamily: '"Playfair Display", serif' }}
              onClick={() => navigate("/")}
            >
              Agnishikha
            </div>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <button
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-purple-700 transition-colors duration-200"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Back to Products</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden aspect-square">
              <img
                src={image[selectedImage]}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 ${
                    selectedImage === index
                      ? "border-purple-600 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                {name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-4">
                <StarRating rating={rating} />
                <span className="text-xs sm:text-sm text-gray-500">
                  {rating} reviews
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-700">
                  ₹{finalPrice.toFixed(0)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base sm:text-lg lg:text-xl text-gray-400 line-through">
                      ₹{price.toFixed(0)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs sm:text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">per piece</span>
            </div>

            {/* Minimum Pieces */}
            <div className="flex items-center gap-2 bg-purple-50 px-3 sm:px-4 py-2 rounded-lg w-fit">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
              <span className="text-xs sm:text-sm font-medium text-purple-700">
                Minimum {minimum} pcs
              </span>
            </div>

            {/* Description with Show More/Less */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 max-h-64 overflow-auto">
  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
    Product Description
  </h3>
  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed break-words">
    {displayDescription}
    {isLongDescription && !showFullDescription && "..."}
  </p>
  {isLongDescription && (
    <button
      onClick={() => setShowFullDescription(!showFullDescription)}
      className="flex items-center gap-1 mt-2 text-purple-700 hover:text-purple-800 font-medium text-xs sm:text-sm transition-colors duration-200"
    >
      {showFullDescription ? (
        <>
          Show Less <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </>
      ) : (
        <>
          Show More <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </>
      )}
    </button>
  )}
</div>


            {/* Quantity Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Quantity:
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                  <input
                    type="text"
                    value={selectedQuantity}
                    readOnly
                    className="w-12 sm:w-16 text-center text-sm sm:text-base font-semibold text-gray-900 bg-white border-x-2 border-gray-200 py-2 sm:py-3"
                  />
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity >= quantity}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                </div>
                {selectedQuantity >= quantity && (
                  <span className="text-xs sm:text-sm text-red-600 font-medium">
                    Max stock reached
                  </span>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-purple-100">
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">
                  Total Price:
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-purple-700">
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
                <p className="text-red-600 text-xs sm:text-sm font-medium bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                  Purchase available for minimum {minimum} pieces
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r 
                     from-purple-600 to-indigo-500 text-white py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6
                     rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-600"
                  disabled={selectedQuantity < minimum || alreadyInCart}
                  onClick={addToCart}
                >
                  {alreadyInCart ? (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      Already in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add To Cart
                    </>
                  )}
                </button>

                {alreadyInCart && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6
                       rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 border-2 border-purple-700 hover:bg-purple-50"
                  >
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    Go to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductViewPage;