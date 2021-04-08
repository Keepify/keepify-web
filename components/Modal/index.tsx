import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 },
};

type Props = {
  onClose?: () => void;
  isOpen?: boolean;
  children?: JSX.Element;
  overlayBackgroundColor?: string;
};

const Modal: React.FC<Props> = ({ onClose, overlayBackgroundColor, children, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-full h-full z-50"
            style={{ backgroundColor: overlayBackgroundColor ?? 'rgba(29, 34, 46, 0.75)' }}
            initial={'initial'}
            animate={'isOpen'}
            exit={'exit'}
            variants={modalVariant}
          />
          <motion.div
            className="flex justify-center items-center z-50 fixed top-0 right-0 bottom-0 left-0 overflow-auto outline-none"
            onClick={onClose}
            initial={'initial'}
            animate={'isOpen'}
            exit={'exit'}
            variants={modalVariant}
          >
            <div
              className="flex justify-center items-center w-max"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Modal);
