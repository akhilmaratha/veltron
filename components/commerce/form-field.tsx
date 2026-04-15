import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "password" | "number" | "textarea";
  placeholder?: string;
  value?: string;
  rows?: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  rows = 4,
  inputProps,
  textareaProps,
}: FormFieldProps) {
  const baseClassName = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
        {label}
      </span>
      {type === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          defaultValue={value}
          className={baseClassName}
          {...textareaProps}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          className={baseClassName}
          {...inputProps}
        />
      )}
    </label>
  );
}