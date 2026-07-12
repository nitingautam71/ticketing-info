import { ShieldCheck, Star, Users, Clock } from 'lucide-react';
import { prisma } from '@/lib/db';

const STATS = [
  { icon: Clock, label: 'XX+ Years in Business' },
  { icon: Users, label: 'XX,XXX+ Bookings Completed' },
  { icon: Star, label: 'X.X★ Average Rating' },
];

export default async function TrustSignals() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <s.icon className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-neutral-200">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-soft rounded-2xl p-4 flex items-center gap-3 mb-8">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span className="text-xs font-bold text-neutral-200">
          No online payment required — you only pay once a consultant confirms your booking.
        </span>
      </div>

      {testimonials.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="glass rounded-2xl p-5">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-sand-400 fill-sand-400' : 'text-neutral-700'}`} />
                ))}
              </div>
              <p className="text-neutral-200 text-xs leading-relaxed mb-2">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[11px] font-bold text-white">
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
