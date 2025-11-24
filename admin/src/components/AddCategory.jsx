import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

// Add Category Dialog Component
export const AddCategoryDialog = ({ isOpen, onClose, existingCategories, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    // Check if fields are empty
    if (!categoryName.trim() || !description.trim()) {
      return;
    }
    
    // Check if category already exists
    const categoryExists = existingCategories.some(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryExists) {
      setShowError(true);
      return;
    }
    

    // Add the category
    onAddCategory({
      id: `cat${Date.now()}`,
      name: categoryName,
      description: description,
      productCount: 0,
      imageUrl: null,
      status: isActive ? 'Active' : 'Inactive',
    });

    // Reset form and close
    setCategoryName('');
    setDescription('');
    setIsActive(true);
    setShowError(false);
    onClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setDescription('');
    setIsActive(true);
    setShowError(false);
    onClose();
  };

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
    setShowError(false); // Hide error when user starts typing
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Add New Category
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Category Name Input */}
          <div>
            <label htmlFor="categoryName" className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={handleNameChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter category name"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
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
              <label htmlFor="activeSwitch" className="block text-sm font-semibold text-gray-700">
                Category Status
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {isActive ? 'Currently Active' : 'Currently Inactive'}
              </p>
            </div>
            <button
              type="button"
              id="activeSwitch"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Error Message - Hidden by default */}
          {showError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <p className="text-red-600 text-sm font-medium">
                ⚠️ Category already exists! Please use a different name.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};