import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className={`
      fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border
      ${isSuccess 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
      }
      max-w-md animate-in slide-in-from-right duration-300
    `}>
      <div className="flex items-start space-x-3">
        {isSuccess ? (
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
