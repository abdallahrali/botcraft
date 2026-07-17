import React, { useId } from 'react';

/**
 * McInput — Minecraft-themed input field with optional label, icon, and error.
 *
 * @param {string}         label     – label text (rendered in font-pixel)
 * @param {string}         error     – error message shown below input
 * @param {React.ReactNode} icon    – optional icon element rendered inside the input
 * @param {string}         className – extra classes for the wrapper
 */
const McInput = ({ label, error, icon, className = '', ...rest }) => {
  const id = useId();
  const inputId = rest.id ?? id;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="font-pixel text-[10px] text-gray-300 tracking-wider uppercase"
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Optional icon */}
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-mc-stone pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          className={[
            'mc-inset-box w-full font-body text-lg text-white px-3 py-2.5 outline-none',
            'placeholder:text-mc-stone-shadow placeholder:font-body',
            'focus:ring-2 focus:ring-mc-grass/60 focus:ring-offset-0 transition-shadow',
            icon ? 'pl-10' : '',
            error ? 'ring-2 ring-mc-redstone/50' : '',
          ].join(' ')}
          {...rest}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="font-body text-sm text-mc-redstone mt-0.5 flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-mc-redstone" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default McInput;
