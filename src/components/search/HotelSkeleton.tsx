export default function HotelSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-md flex flex-col sm:flex-row animate-pulse" aria-hidden="true">
      <div className="w-full sm:w-[240px] h-[180px] sm:h-auto bg-neutral-800 shrink-0" />
      <div className="p-5 flex-1 flex flex-col justify-between gap-6">
        <div className="space-y-2.5">
          <div className="h-3 w-24 bg-neutral-800 rounded" />
          <div className="h-4 w-2/3 bg-neutral-800 rounded" />
          <div className="h-3 w-1/2 bg-neutral-800 rounded" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-20 bg-neutral-800 rounded-lg" />
            <div className="h-5 w-20 bg-neutral-800 rounded-lg" />
            <div className="h-5 w-16 bg-neutral-800 rounded-lg" />
          </div>
        </div>
        <div className="flex justify-between items-end border-t border-neutral-800/60 pt-4">
          <div className="h-4 w-28 bg-neutral-800 rounded" />
          <div className="h-9 w-28 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
