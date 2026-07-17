import { LucideIcon, SearchX, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface StateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

function StateBlock({ title, message, actionLabel, onAction, icon: Icon }: StateProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-line px-6 py-16 text-center">
      {Icon && <Icon className="h-8 w-8 text-ink/40" strokeWidth={1.5} />}
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink/60">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No listings match those filters",
  message = "Try widening your budget, clearing a filter, or searching a nearby locality.",
  actionLabel,
  onAction,
}: Partial<StateProps>) {
  return (
    <StateBlock
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      icon={SearchX}
    />
  );
}

export function ErrorState({
  title = "Couldn't load this",
  message = "The request failed. Check your connection and try again.",
  actionLabel = "Retry",
  onAction,
}: Partial<StateProps>) {
  return (
    <StateBlock
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      icon={AlertTriangle}
    />
  );
}
