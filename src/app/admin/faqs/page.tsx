import { prisma } from '@/lib/db';
import NewFaqForm from '@/components/admin/NewFaqForm';
import FaqActions from '@/components/admin/FaqActions';

export const dynamic = 'force-dynamic';

export default async function AdminFaqsPage() {
  const faqs = await prisma.faqEntry.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">FAQs</h1>
        <p className="text-sm text-neutral-400 mt-1">Shown on the FAQ / help pages when published.</p>
      </div>

      <NewFaqForm />

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">No FAQs yet.</div>
        ) : (
          faqs.map((f) => (
            <div key={f.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  {f.category && (
                    <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {f.category}
                    </span>
                  )}
                  <p className="text-sm font-bold text-white mt-1.5">{f.question}</p>
                </div>
                <FaqActions id={f.id} published={f.published} />
              </div>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">{f.answer}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
