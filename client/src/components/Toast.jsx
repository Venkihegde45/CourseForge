import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const Toast = ({ message, type = 'error', onClose, duration = 5000 }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm border-2 ${
            type === 'error'
              ? 'bg-red-500/10 border-red-500/50 text-red-400'
              : type === 'success'
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-blue-500/10 border-blue-500/50 text-blue-400'
          }`}
        >
          {type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          <span className="font-medium">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error', duration = 5000) => {
    setToast({ message, type, duration });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
};

