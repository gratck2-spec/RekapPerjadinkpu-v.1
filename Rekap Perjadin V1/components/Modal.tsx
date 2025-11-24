import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'normal' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'normal' }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100 opacity-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`px-6 py-4 border-b flex justify-between items-center ${type === 'danger' ? 'bg-red-50 border-red-100' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-bold ${type === 'danger' ? 'text-red-700' : 'text-gray-800'}`}>
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};