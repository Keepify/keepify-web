import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: JSX.Element;
  suffixElement?: JSX.Element;
  containerClassName?: string;
}

const Input: React.FC<Props> = ({
  containerClassName,
  className,
  prefixElement,
  suffixElement,
  ...props
}) => {
  return (
    <div
      className={`flex flex-wrap items-stretch w-full relative h-15 bg-white items-center pr-10${
        containerClassName ? ' ' + containerClassName : ''
      }`}
    >
      {prefixElement && (
        <span className="flex -mr-px justify-center w-15 p-4">{prefixElement}</span>
      )}

      <input
        type="text"
        className={`flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 border-grey-light rounded rounded-l-none pr-3 self-center relative placeholder-light-grey focus:outline-none${
          className ? ' ' + className : ''
        }`}
        autoComplete="off"
        {...props}
      />

      {suffixElement && <span className="flex -mr-px">{suffixElement}</span>}
    </div>
  );
};

export default Input;
