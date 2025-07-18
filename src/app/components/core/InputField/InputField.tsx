'use client'

import React, { useId } from 'react';
import clsx from 'clsx';
import Input from "@/app/components/core/Input/Input";

interface InputFiledProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFiledProps>(
  (
    {
      label,
      error,
      containerClassName,
      inputClassName,
      labelClassName,
      errorClassName,
      id,
      ...props
    },
    ref
  ) => {

    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className={clsx(containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'text-sm font-medium text-gray-700 text-start',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <Input
          id={inputId}
          ref={ref}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={clsx(
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            inputClassName
          )}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className={clsx('text-xs text-red-600 mt-1', errorClassName)}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
