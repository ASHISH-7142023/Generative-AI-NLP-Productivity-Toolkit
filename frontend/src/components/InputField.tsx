import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  isTextArea?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  isTextArea = false,
  rows = 4,
  maxLength = 10000,
  error,
  helperText,
  disabled = false,
}) => {
  const currentLength = value?.length || 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-xs font-semibold text-text-primary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {maxLength && (
          <span
            className={`text-[11px] tabular-nums ${
              currentLength > maxLength * 0.9 ? 'text-amber-600 font-medium' : 'text-slate-400'
            }`}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/20 ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-border-color focus:border-primary-accent'
          } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''}`}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-slate-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/20 ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-border-color focus:border-primary-accent'
          } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''}`}
        />
      )}

      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
};
