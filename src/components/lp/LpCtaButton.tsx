export default function LpCtaButton({ label = 'Get My Free Quote' }: { label?: string }) {
  return (
    <div className="flex justify-center py-8">
      <a
        href="#lead-form"
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-black px-8 py-4 rounded-full transition-colors shadow-lg shadow-emerald-500/30 cursor-pointer"
      >
        {label} →
      </a>
    </div>
  );
}
