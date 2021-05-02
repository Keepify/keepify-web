import { useState, useEffect } from 'react';

type Size = {
  innerHeight: number;
  innerWidth: number;
  outerHeight: number;
  outerWidth: number;
};

function getSize(): Size {
  return {
    innerHeight: typeof window === 'undefined' ? 0 : window.innerHeight,
    innerWidth: typeof window === 'undefined' ? 0 : window.innerWidth,
    outerHeight: typeof window === 'undefined' ? 0 : window.outerHeight,
    outerWidth: typeof window === 'undefined' ? 0 : window.outerWidth,
  };
}

export default function useWindowSize(): Size {
  const [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
