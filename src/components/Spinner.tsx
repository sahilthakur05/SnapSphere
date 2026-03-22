interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
};

export function Spinner({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-brand-500 border-t-transparent ${sizes[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Inline button spinner — white, for use inside colored buttons */
export function ButtonSpinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
}
