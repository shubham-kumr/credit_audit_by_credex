export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Loading audit results...">
      {/* Hero skeleton */}
      <div className="h-44 bg-neutral-100 rounded-xl" />
      {/* Summary skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-neutral-100 rounded w-full" />
        <div className="h-4 bg-neutral-100 rounded w-5/6" />
        <div className="h-4 bg-neutral-100 rounded w-4/6" />
      </div>
      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-neutral-100 rounded-md" />
      ))}
    </div>
  );
}
