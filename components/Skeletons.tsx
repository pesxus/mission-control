export function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
      <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
      <div className="mt-2 space-y-1">
        <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <div className="h-6 w-6 animate-pulse rounded-full bg-stone-200" />
          <div className="h-6 w-6 animate-pulse rounded-full bg-stone-200" />
        </div>
        <div className="h-3 w-16 animate-pulse rounded bg-stone-200" />
      </div>
    </div>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="flex w-[280px] shrink-0 flex-col rounded-lg border border-stone-200 bg-stone-50/80 p-4">
      <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
      <div className="mt-2 h-6 w-8 animate-pulse rounded bg-stone-200" />
      <div className="mt-4 space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
      <div className="h-3 w-1/4 animate-pulse rounded bg-stone-200" />
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
      <div className="flex-1 space-y-1">
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-32 animate-pulse rounded bg-stone-200" />
      </div>
    </div>
  );
}
