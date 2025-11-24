import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg text-white transition-all transform translate-y-0 opacity-100 ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    }`}>
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white bg-white/20 rounded-lg">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white hover:text-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8">
        <X size={16} />
      </button>
    </div>
  );
};