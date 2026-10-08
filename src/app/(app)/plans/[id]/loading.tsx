// Mirrors the layout of the plan page so content doesn't jump when it loads.
export default function PlanLoading() {
  return (
    <div
      aria-busy
      aria-label="Loading plan"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-6"
    >
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {[0, 1].map((column) => (
          <div key={column} className="flex flex-col gap-2">
            <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-wrap gap-1.5">
              {[0, 1, 2].map((badge) => (
                <div key={badge} className="h-5 w-16 animate-pulse rounded-4xl bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
        {[0, 1, 2].map((card) => (
          <div key={card} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
