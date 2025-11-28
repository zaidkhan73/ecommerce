import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-200 flex flex-col 
  ${
    product.status === "out_of_stock"
      ? "opacity-60 cursor-not-allowed"
      : "hover:shadow-md cursor-pointer"
  }`}
      onClick={() => {
        if (product.status !== "out_of_stock") {
          navigate(`/product/${product._id}`);
        }
      }}
    >
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.product_image[0].url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.product_discount > 0 && (
          <span className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            {product.product_discount}% OFF
          </span>
        )}

        {/* Out of Stock Badge */}
    {product.status === "out_of_stock" && (
      <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-semibold px-2 py-1 rounded-md shadow-sm">
        OUT OF STOCK
      </span>
    )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 flex-grow">
          {product.product_description}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg sm:text-xl font-bold text-purple-700">
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
