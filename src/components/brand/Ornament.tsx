import { cn } from "@/lib/cn";

export function StarOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("h-24 w-24", className)}
    >
      <rect
        x="14"
        y="14"
        width="72"
        height="72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="14"
        width="72"
        height="72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(45 50 50)"
      />
    </svg>
  );
}
