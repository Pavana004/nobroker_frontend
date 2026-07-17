import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink/40",
            "focus:border-teal focus:outline-none",
            error && "border-brick",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {hint && !error && <p className="text-xs text-ink/60">{hint}</p>}
        {error && <p className="text-xs text-brick">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
