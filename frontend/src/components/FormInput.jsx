import React from 'react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  const inputId = `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'input'}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-lg border-2
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-all duration-200
          ${error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-violet-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

