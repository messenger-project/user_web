'use client'

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', className, disabled, ...props }, ref) => {
    const inputClass = clsx(
      'w-full px-4 py-2 rounded-xl border text-sm transition',
      'focus:outline-none focus:ring-2 focus:ring-blue-500',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClass}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
