/**
 * @fileoverview Reusable Input component.
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
}

/**
 * Reusable input field with optional label and unit suffix.
 * @param props - Input props including label and unit
 */
export const Input: React.FC<InputProps> = ({ label, unit, className = '', id, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={`w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${unit ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 text-xs text-slate-400 font-mono">{unit}</span>
        )}
      </div>
    </div>
  );
};
