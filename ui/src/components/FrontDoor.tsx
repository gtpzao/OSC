import { Rocket, Zap } from "lucide-react";
import { cn } from "../lib/utils";

interface FrontDoorProps {
  onChoose: (path: "create" | "grow") => void;
}

export function FrontDoor({ onChoose }: FrontDoorProps) {
  return (
    <div className="flex min-h-[68vh] items-center justify-center px-6 py-8">
      <div className="w-full max-w-4xl border border-border bg-[linear-gradient(145deg,rgba(196,255,103,0.09),transparent_32%),linear-gradient(180deg,rgba(255,159,47,0.08),transparent_42%),var(--ork-panel)] p-6 shadow-[var(--ork-shadow)]">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="h-2 w-2 bg-primary" />
                ORK Software Factory
              </div>
              <div className="space-y-3">
                <h2
                  className="text-2xl leading-tight text-foreground sm:text-3xl"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  Build with Paperclip. Launch with ORK.
                </h2>
                <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                  Start from the BIRCK baseline, run it on free local-first
                  defaults, and route the work through a factory instead of a
                  blank board.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Paperclip core preserved",
                "FCC + NVIDIA NIM defaults",
                "BIRCK baseline bundled",
              ].map((item) => (
                <div key={item} className="border border-border bg-background/60 px-3 py-3 text-xs text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              className={cn(
                "group flex h-full flex-col justify-between border border-border bg-background/70 p-5 text-left transition-all",
                "hover:border-primary/70 hover:bg-accent/60 hover:shadow-[0_0_30px_rgba(196,255,103,0.16)]",
              )}
              onClick={() => onChoose("create")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="border border-primary/30 bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
                  <Rocket className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                  New Factory
                </span>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-foreground">Build a new ORK company</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Spin up the BIRCK starter, wire the runtime once,
                  and open with a staffed delivery org instead of one solo agent.
                </p>
              </div>
            </button>

            <button
              className={cn(
                "group flex h-full flex-col justify-between border border-border bg-background/70 p-5 text-left transition-all",
                "hover:border-[#ffb24f]/70 hover:bg-accent/60 hover:shadow-[0_0_30px_rgba(255,159,47,0.18)]",
              )}
              onClick={() => onChoose("grow")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="border border-[#ffb24f]/35 bg-[#ff9f2f]/12 p-3 text-[#ffb24f] transition-colors group-hover:bg-[#ff9f2f]/20">
                  <Zap className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffcb87]">
                  Existing Org
                </span>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-foreground">Add agents to your current flow</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Keep the current team, map your bottlenecks, and expand the
                  factory around work that already exists.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
