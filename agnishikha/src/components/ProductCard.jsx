import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 flex flex-col h-full w-full
      ${
        product.status === "out_of_stock" || product.product_category?.isActive === false
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md hover:-translate-y-1 cursor-pointer"
      }`}
      onClick={() => {
       if (
  product.status !== "out_of_stock" &&
  product.product_category?.isActive !== false
) {
          navigate(`/product/${product._id}`);
        }
      }}
    >
      {/* Product Image - Fixed Aspect Ratio */}
      <div className="relative w-full aspect-square bg-gray-100 flex-shrink-0">
        <img
          src={product.product_image[0].url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        {product.product_discount > 0 && (
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
            {product.product_discount}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
        {(product.status === "out_of_stock" || product.product_category?.isActive === false) && (
  <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md shadow-sm">
    OUT OF STOCK
  </span>
)}

      </div>

      {/* Product Details - Fixed Height */}
      <div className="p-2.5 sm:p-3 lg:p-4 flex flex-col flex-grow min-h-0">
        {/* Product Name - Fixed Lines */}
        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 sm:mb-1.5 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Product Description - Fixed Lines */}
        <p className="text-gray-600 text-[11px] sm:text-xs mb-2 sm:mb-3 line-clamp-2 flex-grow min-h-[2rem] sm:min-h-[2.5rem]">
          {product.product_description}
        </p>

        {/* Price Section - Fixed at Bottom */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-1">
          <span className="text-sm sm:text-base lg:text-lg font-bold text-purple-700">
            ₹{product.final_price.toFixed(0)}
          </span>
          {product.product_discount > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{product.product_price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};