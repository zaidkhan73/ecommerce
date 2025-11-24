import { Trash2 } from 'lucide-react';


const DeleteWarningDialog = ({ isOpen, onClose, productCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cannot Delete Category</h3>
            <p className="text-gray-600 text-sm mb-4">
              This category contains <span className="font-bold text-red-600">{productCount} product{productCount !== 1 ? 's' : ''}</span>. 
              Please delete all products in this category before deleting the category itself.
            </p>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteWarningDialog;