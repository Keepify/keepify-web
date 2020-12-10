import { memo } from 'react';
import { motion } from 'framer-motion';

const Button = ({ children }) => {
  return (
    <motion.button
      whileHover={{ translateY: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-orange px-10 py-3 text-white rounded-lg focus:outline-none"
    >
      {children}
    </motion.button>
  );
};

export default memo(Button);
