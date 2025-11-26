export const ProductCard = ({ product }) => {
  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            {product.discount}% OFF
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg sm:text-xl font-bold text-purple-700">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-indigo-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
          Add to Cart
        </button>
      </div>
    </div>
  );
};