import { useState, useEffect, ReactNode } from 'react';
import memo from 'helpers/memo';
import Portal from '@reach/portal';
import { X } from 'react-feather';

type Props = {
  show?: boolean;
  onClose?: () => void;
  children?: ReactNode;
};

const Drawer: React.FC<Props> = ({ show, children, onClose }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isDrawerMounted, setIsDrawerMounted] = useState(show);

  useEffect(() => {
    function handleEscKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleEscKey);

    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  useEffect(() => {
    if (show) {
      setIsDrawerMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = null;
    }
  }, [show]);

  useEffect(() => {
    if (isDrawerMounted) {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [isDrawerMounted]);

  if (isDrawerMounted) {
    return (
      <Portal>
        <div
          className="h-full bg-purple fixed top-0 left-0 lg:w-96 w-full z-50 overflow-y-auto"
          onTransitionEnd={() => !isVisible && setIsDrawerMounted(false)}
          style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <span className="absolute top-8 right-8 cursor-pointer" onClick={onClose}>
            <X size={24} color="#fff" />
          </span>
          <ul className="px-12 py-28">{children}</ul>
        </div>
        {show && (
          <div
            className="fixed w-full h-full z-40 top-0 left-0"
            style={{ backgroundColor: 'rgba(46, 49, 55, 0.75)' }}
            onClick={onClose}
          />
        )}
      </Portal>
    );
  }

  return null;
};

export default memo(Drawer);
