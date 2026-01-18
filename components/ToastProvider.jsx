'use client';

import { createContext, useContext, useState, useRef } from 'react';
import { Transition } from '@headlessui/react';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Context setup
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

// ToastProvider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef({});

  // Toast adding with clear
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    // Clean up timeout if replaced quickly
    if (timeoutRefs.current[id]) clearTimeout(timeoutRefs.current[id]);
    timeoutRefs.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete timeoutRefs.current[id];
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timeoutRefs.current[id]) clearTimeout(timeoutRefs.current[id]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toasts */}
      <div className="fixed top-5 right-5 z-50 w-full max-w-sm space-y-4">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            show={true}
            appear
            enter="transform transition duration-300"
            enterFrom="translate-y-2 opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="transform transition duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <div
              role="status"
              aria-live="polite"
              className={`relative flex items-start gap-3 rounded-sm px-5 py-4 shadow-2xl border text-base font-semibold ${
                toast.type === 'info'
                  ? 'bg-blue-600/95 border-blue-700 text-white'
                  : toast.type === 'success'
                  ? 'bg-green-600/95 border-green-700 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-600/95 border-red-700 text-white'
                  : toast.type === 'warning'
                  ? 'bg-yellow-400/95 border-yellow-500 text-slate-800'
                  : 'bg-gray-700/95 border-gray-600 text-white'
              }`}
            >
              {/* Icon */}
              <span className="flex-shrink-0 mt-0.5">
                {typeToIcon(toast.type)}
              </span>
              {/* Message */}
              <div className="flex-1">{toast.message}</div>
              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/80 p-1"
                aria-label="Close notification"
                tabIndex={0}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
                <div className={`animate-toast-bar
                  ${toast.type === 'info'
                    ? 'bg-blue-300/80'
                    : toast.type === 'success'
                    ? 'bg-green-300/80'
                    : toast.type === 'error'
                    ? 'bg-red-300/80'
                    : toast.type === 'warning'
                    ? 'bg-yellow-200/80'
                    : 'bg-slate-300/80'}
                `} />
              </div>
            </div>
          </Transition>
        ))}
      </div>
      {/* Custom animation for progress */}
      <style jsx global>{`
        .animate-toast-bar {
          height: 100%;
          width: 100%;
          transform-origin: left;
          animation: toastBarAnim 3.7s linear forwards;
        }
        @keyframes toastBarAnim {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Icon based on type
function typeToIcon(type) {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="h-6 w-6 text-green-200" />;
    case 'error':
      return <ExclamationCircleIcon className="h-6 w-6 text-red-200" />;
    case 'warning':
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-700" />;
    default:
      return <InformationCircleIcon className="h-6 w-6 text-blue-200" />;
  }
}
