import clsx from "clsx";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "teal" | "brick" | "brass";
}) {
  const toneClasses = {
    neutral: "border-line text-ink/70",
    teal: "border-teal text-teal",
    brick: "border-brick text-brick",
    brass: "border-brass text-brass",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
