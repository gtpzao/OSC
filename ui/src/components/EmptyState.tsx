import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, message, action, onAction }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center border border-dashed border-primary/20 bg-[linear-gradient(180deg,rgba(20,30,15,0.7),rgba(11,17,8,0.86))] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(196,255,103,0.08),0_20px_44px_rgba(0,0,0,0.22)]">
      <div className="mb-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="mb-5 flex h-20 w-20 items-center justify-center border border-primary/25 bg-[radial-gradient(circle_at_top,rgba(196,255,103,0.18),rgba(16,24,13,0.96))] shadow-[0_0_0_1px_rgba(196,255,103,0.07),0_18px_36px_rgba(0,0,0,0.28)]">
        <Icon className="h-10 w-10 text-primary/70" />
      </div>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
      {action && onAction && (
        <Button variant="cta" onClick={onAction} className="mt-6">
          <Plus className="h-4 w-4 mr-1.5" />
          {action}
        </Button>
      )}
      <div className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}
