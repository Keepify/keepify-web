import { memo } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

type Props = {
  text?: string;
};

const Loader: React.FC<Props> = ({ text }) => {
  return (
    <div
      className="fixed w-screen h-screen flex justify-center items-center bg-dark bg-opacity-75"
      style={{ zIndex: 100 }}
    >
      <div className="flex flex-col items-center max-w-2xl">
        <MoonLoader size={80} color="#FF8E6E" />
        {text && <p className="mt-4 text-lg text-orange">{text}</p>}
      </div>
    </div>
  );
};

export default memo(Loader);
