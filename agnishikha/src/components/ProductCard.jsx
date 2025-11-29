import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 flex flex-col w-full max-w-[280px] h-[340px]
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
      {/* Product Image - Fixed Size */}
      <div className="relative w-full h-[180px] bg-gray-100 flex-shrink-0">
        <img
          src={product.product_image[0].url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        {product.product_discount > 0 && (
          <span className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.product_discount}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
        {(product.status === "out_of_stock" || product.product_category?.isActive === false) && (
  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm">
    OUT OF STOCK
  </span>
)}

      </div>

      {/* Product Details - Fixed Height */}
      <div className="p-3 flex flex-col flex-grow h-[160px]">
        {/* Product Name - Fixed Lines */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 h-[2.5rem]">
          {product.name}
        </h3>

        {/* Product Description - Fixed Lines */}
        <p className="text-gray-600 text-xs mb-2 line-clamp-2 flex-grow h-[2.5rem]">
          {product.product_description}
        </p>

        {/* Price Section - Fixed at Bottom */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-purple-700">
            ₹{product.final_price.toFixed(0)}
          </span>
          {product.product_discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.product_price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};