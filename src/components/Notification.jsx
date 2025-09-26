import React, { useEffect } from "react";

export default function Notification({ message, type = "success", onClose, autoDismiss = 5000 }) {
  if (!message) return null;

  useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(onClose, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-700 border-red-600";
      case "warning":
        return "bg-yellow-700 border-yellow-600";
      case "info":
        return "bg-blue-700 border-blue-600";
      default:
        return "bg-green-700 border-green-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return "⚠️";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border animate-fade-in flex items-center max-w-md`}>
      <span className="mr-2 text-lg">{getIcon()}</span>
      <span className="flex-1">{message}</span>
      <button 
        className="ml-4 text-white hover:text-gray-200 text-xl leading-none" 
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
      <style>{`
        @keyframes fade-in { 
          from { 
            opacity: 0; 
            transform: translateX(100%) translateY(-10px); 
          } 
          to { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
          } 
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
