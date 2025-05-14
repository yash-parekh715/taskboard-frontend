

import React from "react";
import { XCircle } from "lucide-react";

function Errorpopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-1/3 text-center border border-red-100">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center h-14 w-14 bg-red-50 rounded-full">
            <XCircle size={28} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Error</h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Errorpopup;
