import { useEffect, useState } from "react";
import { Link } from "@/lib/router";
import { X } from "lucide-react";
import {
  useToastActions,
  useToastState,
  type ToastItem,
  type ToastTone,
} from "../context/ToastContext";
import { cn } from "../lib/utils";

const toneClasses: Record<ToastTone, string> = {
  info: "border-[#36586a] border-l-[#77d8ff] bg-[linear-gradient(135deg,rgba(15,26,26,0.97),rgba(15,31,35,0.93))] text-[#e0f8ff]",
  success: "border-[#2b5932] border-l-[#c4ff67] bg-[linear-gradient(135deg,rgba(14,24,12,0.97),rgba(19,35,16,0.93))] text-[#efffd5]",
  warn: "border-[#7a4a19] border-l-[#ffb24f] bg-[linear-gradient(135deg,rgba(26,18,10,0.97),rgba(48,28,12,0.93))] text-[#fff0cf]",
  error: "border-[#7b2f21] border-l-[#ff7d47] bg-[linear-gradient(135deg,rgba(27,13,10,0.97),rgba(46,17,13,0.93))] text-[#ffe3d6]",
};

const toneDotClasses: Record<ToastTone, string> = {
  info: "bg-sky-500 dark:bg-sky-400",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warn: "bg-amber-500 dark:bg-amber-400",
  error: "bg-red-500 dark:bg-red-400",
};

function AnimatedToast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <li
      className={cn(
        "pointer-events-auto overflow-hidden rounded-none border border-l-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-[transform,opacity] duration-200 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0",
        toneClasses[toast.tone],
      )}
    >
      <div className="flex items-start gap-3 px-3 py-2.5">
        <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", toneDotClasses[toast.tone])} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] leading-5">{toast.title}</p>
          {toast.body && (
            <p className="mt-1 text-xs leading-5 text-current/72">
              {toast.body}
            </p>
          )}
          {toast.action && (
            <Link
              to={toast.action.href}
              onClick={() => onDismiss(toast.id)}
              className="mt-2 inline-flex text-[10px] font-semibold uppercase tracking-[0.18em] text-primary underline underline-offset-4 hover:text-[#fff3b1]"
            >
              {toast.action.label}
            </Link>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(toast.id)}
          className="mt-0.5 shrink-0 rounded-none border border-transparent p-1 text-current/65 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-current"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

export function ToastViewport() {
  const toasts = useToastState();
  const { dismissToast } = useToastActions();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-3 bottom-4 z-[120] sm:left-auto sm:right-4 sm:w-full sm:max-w-sm"
    >
      <ol className="flex w-full flex-col-reverse gap-2">
        {toasts.map((toast) => (
          <AnimatedToast
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </ol>
    </aside>
  );
}
