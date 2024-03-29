import memo from 'helpers/memo';
import { motion } from 'framer-motion';

const Button: React.FC<React.HTMLProps<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <>
      {/** @ts-ignore */}
      <motion.button
        whileHover={{ translateY: -5 }}
        transition={{ duration: 0.3 }}
        className={`bg-orange px-10 py-3 text-white rounded-lg outline-none focus:outline-none${
          className ? ' ' + className : ''
        }`}
        {...props}
      >
        {children}
      </motion.button>
    </>
  );
};

export default memo(Button);
