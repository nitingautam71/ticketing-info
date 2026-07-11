import { Star } from 'lucide-react';
import { prisma } from '@/lib/db';
import NewTestimonialForm from '@/components/admin/NewTestimonialForm';
import TestimonialActions from '@/components/admin/TestimonialActions';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <p className="text-sm text-neutral-400 mt-1">Shown on marketing pages when published.</p>
      </div>

      <NewTestimonialForm />

      <div className="space-y-3">
        {testimonials.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">No testimonials yet.</div>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-white">
                    {t.name} {t.location && <span className="text-neutral-500 font-normal">— {t.location}</span>}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>
                <TestimonialActions id={t.id} published={t.published} />
              </div>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">{t.quote}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
