import { Loader2 } from "lucide-react";

export default function RouteLoadingShell({
  title,
  subtitle,
  showChart = false,
  showEditor = false,
}) {
  return (
    <div className="container mx-auto py-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-white/15 bg-card/70 backdrop-blur-sm p-5 md:p-6 card-shadow">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs md:text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading
          </div>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mb-6">
          <div className="h-full w-1/3 rounded-full creative-gradient animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`metric-${index}`}
              className="rounded-xl border border-white/10 bg-background/40 p-4 space-y-3"
            >
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              <div className="h-7 w-20 rounded bg-muted animate-pulse" />
              <div className="h-2 w-full rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>

        {showChart && (
          <div className="rounded-xl border border-white/10 bg-background/40 p-4 md:p-6 mb-6">
            <div className="h-4 w-40 rounded bg-muted animate-pulse mb-6" />
            <div className="h-[260px] md:h-[340px] w-full rounded-lg border border-dashed border-white/15 bg-background/30 animate-pulse" />
          </div>
        )}

        {showEditor && (
          <div className="rounded-xl border border-white/10 bg-background/40 p-4 md:p-6 mb-6">
            <div className="h-4 w-32 rounded bg-muted animate-pulse mb-4" />
            <div className="h-[320px] md:h-[420px] w-full rounded-lg bg-background/30 animate-pulse" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-background/40 p-4 space-y-3">
            <div className="h-4 w-36 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-3 w-4/6 rounded bg-muted animate-pulse" />
          </div>
          <div className="rounded-xl border border-white/10 bg-background/40 p-4 space-y-3">
            <div className="h-4 w-36 rounded bg-muted animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`chip-${index}`}
                  className="h-7 w-24 rounded-full bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
