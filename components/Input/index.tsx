import { InputHTMLAttributes, forwardRef, memo } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: JSX.Element;
  containerClassName?: string;
  ref?: any;
}

const Input: React.FC<Props> = forwardRef(
  ({ containerClassName, className, prefixElement, ...props }, ref) => {
    return (
      <div
        className={`flex flex-wrap items-stretch w-full relative h-15 bg-white items-center${
          containerClassName ? ' ' + containerClassName : ''
        }`}
      >
        {prefixElement && (
          <span className="flex -mr-px justify-center w-15 p-4">{prefixElement}</span>
        )}

        <input
          ref={ref}
          className={`flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 border-grey-light rounded rounded-l-none self-center relative placeholder-light-grey outline-none focus:outline-none${
            className ? ' ' + className : ''
          }`}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  }
);

export default memo(Input);
