import Link from 'next/link';
import { Star } from 'lucide-react';

type TestimonialLike = { id: string; name: string; location: string | null; quote: string; rating: number };

export default function TestimonialsSection({ testimonials }: { testimonials: TestimonialLike[] }) {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 md:px-8 py-14">
      <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Traveler reviews</p>
      <h2 className="font-display text-3xl md:text-4xl text-white font-medium mb-8">What travelers say</h2>

      {testimonials.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-neutral-200 text-sm max-w-md mx-auto">
            We&apos;re just getting started collecting reviews here. Booked with us? We&apos;d love to hear about your trip —{' '}
            <Link href="/contact" className="text-emerald-400 hover:underline">share your experience</Link>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="glass rounded-3xl p-6 flex flex-col gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-sand-400 fill-sand-400' : 'text-neutral-700'}`} />
                ))}
              </div>
              <p className="text-neutral-100 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-xs font-bold text-white">
                {t.name}
                {t.location && <span className="text-neutral-400 font-normal"> — {t.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
