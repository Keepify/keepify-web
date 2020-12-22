import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: JSX.Element;
  suffixElement?: JSX.Element;
}

const Input: React.FC<Props> = ({ className, prefixElement, ...props }) => {
  return (
    <div className="flex items-center relative">
      {prefixElement && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">{prefixElement}</span>
      )}

      <input
        type="text"
        className={`bg-light-purple placeholder-light-grey rounded-xl pl-${
          prefixElement ? 9 : 4
        } pr-4 py-2 focus:outline-none`}
        // className={`bg-light ${className ? ' ' + className : ''}`}
        autoComplete="off"
        {...props}
      />
      {props.suffixElement ?? null}
    </div>
  );
};

export default Input;
