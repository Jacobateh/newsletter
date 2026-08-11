import { cn } from "@/lib/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
}

export function Field({
  id,
  label,
  error,
  className,
  ...props
}: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={cn("text-left", className)}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-brand-deep"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-2xl border bg-white px-5 py-4 text-base text-foreground placeholder:text-brand-deep/40 transition-colors",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-brand-deep/15 hover:border-brand-gold/60 focus:border-brand-gold",
        )}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-left text-sm font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
