import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: ButtonVariant;
  testId?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      testId = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClass =
      'inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2';
    const variantClass = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    };

    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const buttonClass = clsx(
      baseClass,
      variantClass[variant],
      disabledClass,
      className
    );

    return (
      <button
        ref={ref}
        disabled={disabled}
        data-testid={testId}
        className={buttonClass}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
