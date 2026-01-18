import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WinNotification = ({ isVisible, amount, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-[200] pointer-events-none"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl border border-green-400">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <p className="font-bold text-lg">You Won!</p>
                <p className="text-green-100">{amount}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinNotification;