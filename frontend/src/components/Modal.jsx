import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; 

  return (

    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 h-10 w-10 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
