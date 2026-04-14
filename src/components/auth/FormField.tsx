// src/components/auth/FormField.tsx
import { type InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-navy-dark dark:text-slate-200"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors
            ${
              error
                ? "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500"
                : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
            }`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
