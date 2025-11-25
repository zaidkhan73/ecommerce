import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu, ArrowLeft, Trash2 } from "lucide-react";
import DeleteWarningDialog from "../components/DeleteWarningDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import axios from "axios";
import { serverUrl } from "../App";

export default function EditCategory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProductDeleteConfirm, setShowProductDeleteConfirm] =
    useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - In real app, this would come from props/route params/API
  const [category, setCategory] = useState();

  const [products, setProducts] = useState([]);

  const [description, setDescription] = useState(
    category?.category_description
  );
  const [isActive, setIsActive] = useState(category?.isActive);

  const categoryProducts = products;

  const handleBack = () => {
    navigate("/categories");
  };

  const handleDeleteProductClick = (product) => {
    setProductToDelete(product);
    setShowProductDeleteConfirm(true);
  };

  const handleConfirmProductDelete = async (id) => {
  try {
    if (productToDelete?._id) {
      const res = await axios.delete(
        `${serverUrl}/api/product/delete-product/${productToDelete._id}`,
        { withCredentials: true }
      );
      console.log(res.data);

      // Remove deleted product from state
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setProductToDelete(null);
      setShowProductDeleteConfirm(false);
    }
  } catch (error) {
    console.log(error);
  }
};


  const handleDeleteClick = () => {
    if (categoryProducts.length > 0) {
      setShowDeleteWarning(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/category/delete-category/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/categories");
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async () => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/category/update-category/${id}`,
        {
          category_description: description,
          isActive: isActive,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/categories");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/category/get-category/${id}`,
          { withCredentials: true }
        );
        console.log(res.data.data.products);
        setCategory(res.data.data.category);
        setProducts(res.data.data.products);
        console.log(res.data.data.products._id);

        setDescription(res.data.data.category.category_description);
        setIsActive(res.data.data.category.isActive);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, [id]);

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
              Edit Category
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Categories</span>
          </button>

          {/* Category Details Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">
              Category Details
            </h2>

            {/* Category Name (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-medium">
                {category?.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Category name cannot be changed
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter category description"
              />
            </div>

            {/* Active Status Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label
                  htmlFor="activeSwitch"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Category Status
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {isActive ? "Currently Active" : "Currently Inactive"}
                </p>
              </div>
              <button
                type="button"
                id="activeSwitch"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Products in Category */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Products in this Category ({categoryProducts.length})
            </h2>

            {categoryProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No products in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Price: {product.final_price} | Stock:{" "}
                        {product.inventory_quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProductClick(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Category Button */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-all duration-200 transform hover:scale-105"
          >
            <Trash2 className="w-5 h-5" />
            Delete Category
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
              onClick={updateCategory}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DeleteWarningDialog
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        productCount={categoryProducts.length}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        name={"category"}
      />

      {/* Product Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showProductDeleteConfirm}
        onClose={() => {
          setShowProductDeleteConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmProductDelete}
        name={productToDelete ? `product "${productToDelete.name}"` : "product"}
      />
    </div>
  );
}
